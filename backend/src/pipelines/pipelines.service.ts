import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePipelineDto } from './dtos/create-pipeline.dto';
import { JiraService } from '../jira/jira.service';
import { ConfluenceService } from '../confluence/confluence.service';
import { GetJiraProjectResponseDto } from '../jira/dto/get-jira-project-response.dto';
import { ConfigService } from '../config/config.service';

@Injectable()
export class PipelinesService {
  constructor(
    private jiraService: JiraService,
    private confluenceService: ConfluenceService,
    private configService: ConfigService,
  ) {}

  async createPipeline(createPipelineDto: CreatePipelineDto) {
    // console.log(createPipelineDto);
    let getJiraProjectResponseDto: GetJiraProjectResponseDto;
    let getConfluenceSpaceResponseDto;
    let pipeline = { jira: {}, confluence: {} };
    try {
      /* Create Jira project */
      getJiraProjectResponseDto = await this.jiraService.createProject(
        createPipelineDto,
      );
      pipeline.jira = {
        key: getJiraProjectResponseDto.key,
        name: getJiraProjectResponseDto.name,
        url: `${this.configService.jiraWebBaseURL}/projects/${
          getJiraProjectResponseDto.key
        }`,
      };
      /* Create Confluence Space */
      getConfluenceSpaceResponseDto = await this.confluenceService.createSpace(
        createPipelineDto,
      );
      pipeline.confluence = {
        key: getConfluenceSpaceResponseDto.key,
        name: getConfluenceSpaceResponseDto.name,
        url: `${getConfluenceSpaceResponseDto._links.base}/display/${
          getConfluenceSpaceResponseDto.key
        }`,
      };
      /* Conditionally create BitBucket repo */
      /* Conditionally create Jenkins pipeline */
    } catch (error) {
      // Re-throw error up to handler
      throw error;
    }
    return pipeline;
  }
}
