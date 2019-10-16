import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CreatePipelineDto } from './dtos/create-pipeline.dto';
import { JiraService } from '../jira/jira.service';
import { ConfluenceService } from '../confluence/confluence.service';
import { GetJiraProjectResponseDto } from '../jira/dto/get-jira-project-response.dto';
import { ConfigService } from '../config/config.service';
import { BitbucketService } from '../bitbucket/bitbucket.service';
import { CreateConfluenceSpaceResponseDto } from '../confluence/dto/create-space-request.dto';
import { CreateBitbucketRepositoryResponseDto } from '../bitbucket/dto/create-bitbucket-repository-reponse.dto';
import { CreatePipelineResponseDto } from './dtos/create-pipeline-response.dto';
import { JenkinsService } from '../jenkins/jenkins.service';
import { Logger } from 'winston';
import { CreateJenkinsResponseDto } from '../jenkins/dto/create-jenkins-job-response.dto';

@Injectable()
export class PipelinesService {
  constructor(
    private jiraService: JiraService,
    private confluenceService: ConfluenceService,
    private bitbucketService: BitbucketService,
    private jenkinsService: JenkinsService,
    private configService: ConfigService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async createPipeline(
    createPipelineDto: CreatePipelineDto,
  ): Promise<CreatePipelineResponseDto> {
    let getJiraProjectResponseDto: GetJiraProjectResponseDto;
    let getConfluenceSpaceResponseDto: CreateConfluenceSpaceResponseDto;
    let getBitbucketRepositoryResponseDto: CreateBitbucketRepositoryResponseDto;
    let getJenkinsJobResponseDto: CreateJenkinsResponseDto;

    this.logger.debug(
      `Creating pipeline for project: ${createPipelineDto.projectName}`,
      {
        label: 'PipelinesService : createPipeline',
        project: createPipelineDto,
      },
    );

    try {
      /* Create Jira project */
      getJiraProjectResponseDto = await this.jiraService.createProject(
        createPipelineDto,
      );
      /* Create Confluence Space */
      getConfluenceSpaceResponseDto = await this.confluenceService.createSpace(
        createPipelineDto,
      );
      /* Conditionally create BitBucket repo & Jenkins job */
      if (this.isSoftwareProject(createPipelineDto)) {
        /* Bitbucket */
        getBitbucketRepositoryResponseDto = await this.bitbucketService.createRepository(
          createPipelineDto,
        );
        /* Jenkins */
        getJenkinsJobResponseDto = await this.jenkinsService.copyJob(
          getBitbucketRepositoryResponseDto.slug,
          this.configService.jenkinsCopyFromJobName,
          this.getSshGitUrl(getBitbucketRepositoryResponseDto),
        );
      }

      this.logger.debug(
        `Created pipeline for project: ${createPipelineDto.projectName}`,
        {
          label: 'PipelinesService : createPipeline',
          project: createPipelineDto,
        },
      );

      /* Update PipelineRequest with URLs Jira Issue & Transition to Done */
      // this.jiraService.transitionIssueToDone(createPipelineDto.id);

      /* Return pipelineResponseDto */
      return this.makePipelineResponseDto(
        getJiraProjectResponseDto,
        getConfluenceSpaceResponseDto,
        getBitbucketRepositoryResponseDto,
        getJenkinsJobResponseDto,
      );
    } catch (error) {
      /* Delete anything that was partially created in the event of a failure */
      this.logger.warn(
        `Error creating pipeline for project: ${
          createPipelineDto.projectName
        }. Deleting partial creation.`,
      );

      await this.handlePipelineCreationFailure(
        getJiraProjectResponseDto,
        getConfluenceSpaceResponseDto,
        getBitbucketRepositoryResponseDto,
      );
      // Re-throw error up to top-level handler
      throw error;
    }
  }

  private async handlePipelineCreationFailure(
    getJiraProjectResponseDto: GetJiraProjectResponseDto,
    getConfluenceSpaceResponseDto: CreateConfluenceSpaceResponseDto,
    getBitbucketRepositoryResponseDto: CreateBitbucketRepositoryResponseDto,
  ) {
    if (getJiraProjectResponseDto) {
      const deletedJiraProject = await this.jiraService.deleteProject(
        getJiraProjectResponseDto.key,
      );
    }
    if (getConfluenceSpaceResponseDto) {
      const deletedConfluenceSpace = await this.confluenceService.deleteSpace(
        getConfluenceSpaceResponseDto.key,
      );
    }
    if (getBitbucketRepositoryResponseDto) {
      const deletedBitbucketRepository = await this.bitbucketService.deleteRepository(
        getBitbucketRepositoryResponseDto.slug,
      );
    }
  }

  private makePipelineResponseDto(
    getJiraProjectResponseDto,
    getConfluenceSpaceResponseDto,
    getBitbucketRepositoryResponseDto,
    getJenkinsJobResponseDto,
  ): CreatePipelineResponseDto {
    let createPipelineResponseDto: CreatePipelineResponseDto = {};
    /* Jira */
    if (getJiraProjectResponseDto) {
      createPipelineResponseDto.jira = {
        key: getJiraProjectResponseDto.key,
        name: getJiraProjectResponseDto.name,
        url: `${this.configService.jiraWebBaseURL}/projects/${
          getJiraProjectResponseDto.key
        }`,
      };
    }
    /* Confluence */
    if (getConfluenceSpaceResponseDto) {
      createPipelineResponseDto.confluence = {
        key: getConfluenceSpaceResponseDto.key,
        name: getConfluenceSpaceResponseDto.name,
        url: `${this.configService.confluenceWebBaseURL}/display/${
          getConfluenceSpaceResponseDto.key
        }`,
      };
    }
    /* Bitbucket */
    if (getBitbucketRepositoryResponseDto) {
      createPipelineResponseDto.bitbucket = {
        name: getBitbucketRepositoryResponseDto.name,
        url: `${this.configService.bitbucketWebBaseURL}/projects/${
          this.configService.bitbucketProject
        }/repos/${getBitbucketRepositoryResponseDto.slug}`,
      };
    }
    /* Bitbucket */
    if (getJenkinsJobResponseDto) {
      createPipelineResponseDto.jenkins = {
        ...getJenkinsJobResponseDto,
      };
    }

    return createPipelineResponseDto;
  }

  private getSshGitUrl(getBitbucketRepositoryResponseDto): string {
    return getBitbucketRepositoryResponseDto.links.clone.find(link => {
      return link.name == 'ssh';
    }).href;
  }

  private isSoftwareProject(createPipelineDto) {
    return createPipelineDto.projectType === 'software';
  }
}
