import {
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
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
import { Repository } from 'typeorm/repository/Repository';
import { Pipeline } from './pipeline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PipelineArtefact } from './pipeline-artefact.entity';
import { PipelineRequest } from '../pipeline-requests/pipeline-request.entity';
import { PipelineRequestsService } from '../pipeline-requests/pipeline-requests.service';

@Injectable()
export class PipelinesService {
  constructor(
    private jiraService: JiraService,
    private confluenceService: ConfluenceService,
    private bitbucketService: BitbucketService,
    private jenkinsService: JenkinsService,
    private configService: ConfigService,
    @Inject('winston') private readonly logger: Logger,
    private pipelineRequestsService: PipelineRequestsService,
    @InjectRepository(Pipeline)
    private readonly pipelineRepository: Repository<Pipeline>,
  ) {}

  findAll(): Promise<Pipeline[]> {
    return this.pipelineRepository.find({ relations: ['artefacts'] });
  }

  findOne(id: number): Promise<Pipeline> {
    return this.pipelineRepository.findOne({
      where: { id: id },
      relations: ['artefacts'],
    });
  }

  async createPipeline(
    createPipelineDto: CreatePipelineDto,
  ): Promise<Pipeline> {
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
      /* Location Pipeline Request for createPipelineDto*/
      let pipelineRequest = await this.pipelineRequestsService.findOne(
        createPipelineDto.requestId,
      );

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
      /* Save created pipeline to the database */
      const pipeline = this.makePipelineToSaveDb(
        getJiraProjectResponseDto,
        getConfluenceSpaceResponseDto,
        getBitbucketRepositoryResponseDto,
        getJenkinsJobResponseDto,
      );
      const result = await this.pipelineRepository.save(pipeline);

      /* Update Pipeline Request as Done */
      pipelineRequest = await this.pipelineRequestsService.updatePipelineRequestAsDone(
        pipelineRequest.id,
      );

      this.logger.debug(
        `Created pipeline for project: ${createPipelineDto.projectName}`,
        {
          label: 'PipelinesService : createPipeline',
          project: createPipelineDto,
        },
      );

      return result;
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

  private makePipelineToSaveDb(
    getJiraProjectResponseDto,
    getConfluenceSpaceResponseDto,
    getBitbucketRepositoryResponseDto,
    getJenkinsJobResponseDto,
  ): Pipeline {
    let pipeline = new Pipeline();
    pipeline.name = getJiraProjectResponseDto.name;
    let artefactArray: PipelineArtefact[] = [];

    /* Jira */
    if (getJiraProjectResponseDto) {
      let jiraArtefact = new PipelineArtefact();
      jiraArtefact.type = 'JIRA';
      jiraArtefact.key = getJiraProjectResponseDto.key;
      jiraArtefact.name = getJiraProjectResponseDto.name;
      jiraArtefact.url = `${this.configService.jiraWebBaseURL}/projects/${
        getJiraProjectResponseDto.key
      }`;
      artefactArray.push(jiraArtefact);
    }
    /* Confluence */
    if (getConfluenceSpaceResponseDto) {
      let confluenceArtefact = new PipelineArtefact();
      confluenceArtefact.type = 'CONFLUENCE';
      confluenceArtefact.key = getConfluenceSpaceResponseDto.key;
      confluenceArtefact.name = getConfluenceSpaceResponseDto.name;
      confluenceArtefact.url = `${
        this.configService.confluenceWebBaseURL
      }/display/${getConfluenceSpaceResponseDto.key}`;
      artefactArray.push(confluenceArtefact);
    }
    /* Bitbucket */
    if (getBitbucketRepositoryResponseDto) {
      let bitbucketArtefact = new PipelineArtefact();
      bitbucketArtefact.type = 'BITBUCKET';
      bitbucketArtefact.key = getBitbucketRepositoryResponseDto.slug;
      bitbucketArtefact.name = getBitbucketRepositoryResponseDto.name;
      bitbucketArtefact.url = `${
        this.configService.bitbucketWebBaseURL
      }/projects/${this.configService.bitbucketProject}/repos/${
        getBitbucketRepositoryResponseDto.slug
      }`;
      artefactArray.push(bitbucketArtefact);
    }
    /* Jenkins */
    if (getJenkinsJobResponseDto) {
      let jenkinsArtefact = new PipelineArtefact();
      jenkinsArtefact.type = 'JENKINS';
      jenkinsArtefact.key = getJenkinsJobResponseDto.name;
      jenkinsArtefact.name = getJenkinsJobResponseDto.name;
      jenkinsArtefact.url = getJenkinsJobResponseDto.url;

      artefactArray.push(jenkinsArtefact);
    }

    pipeline.artefacts = artefactArray;
    return pipeline;
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
    /* Jenkins */
    if (getJenkinsJobResponseDto) {
      createPipelineResponseDto.jenkins = {
        key: getJenkinsJobResponseDto.name,
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
