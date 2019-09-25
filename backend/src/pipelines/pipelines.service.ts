import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreatePipelineDto } from './dtos/create-pipeline.dto';
import { JiraService } from '../jira/jira.service';
import { ConfluenceService } from '../confluence/confluence.service';
import { GetJiraProjectResponseDto } from '../jira/dto/get-jira-project-response.dto';
import { ConfigService } from '../config/config.service';
import { BitbucketService } from '../bitbucket/bitbucket.service';
import { CreateConfluenceSpaceResponseDto } from '../confluence/dto/create-space-request.dto';
import { CreateBitbucketRepositoryResponseDto } from '../bitbucket/dto/create-bitbucket-repository-reponse.dto';
import { CreatePipelineResponseDto } from './dtos/create-pipeline-response.dto';

@Injectable()
export class PipelinesService {
  private logger = new Logger('PipelinesService');

  constructor(
    private jiraService: JiraService,
    private confluenceService: ConfluenceService,
    private bitbucketService: BitbucketService,
    private configService: ConfigService,
  ) {}

  async createPipeline(createPipelineDto: CreatePipelineDto) {
    let getJiraProjectResponseDto: GetJiraProjectResponseDto;
    let getConfluenceSpaceResponseDto: CreateConfluenceSpaceResponseDto;
    let getBitbucketRepositoryResponseDto: CreateBitbucketRepositoryResponseDto;

    this.logger.verbose(
      `Creating pipeline. Data: ${JSON.stringify(createPipelineDto)}`,
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
      /* Conditionally create BitBucket repo & Jenkins pipeline */
      if (this.isSoftwareProject(createPipelineDto)) {
        getBitbucketRepositoryResponseDto = await this.bitbucketService.createRepository(
          createPipelineDto,
        );
        console.log(getBitbucketRepositoryResponseDto);
      }
      /* Return pipelineResponseDto */
      return this.makePipelineResponseDto(
        getJiraProjectResponseDto,
        getConfluenceSpaceResponseDto,
        getBitbucketRepositoryResponseDto,
      );
    } catch (error) {
      // Delete anything that was partially created in the event of a failure
      this.logger.warn(`Error creating pipeline. Deleting partial creation.`);
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
        url: `${getConfluenceSpaceResponseDto._links.base}/display/${
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
    return createPipelineResponseDto;
  }

  private isSoftwareProject(createPipelineDto) {
    return createPipelineDto.projectType === 'software';
  }
}
