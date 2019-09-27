import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PipelineRequest } from './pipeline-request.model';
import { CreatePipelineRequestDto } from './dtos/create-pipeline-request.dto';
import { GetPipelineRequestFilterDto } from './dtos/get-pipeline-requests-fitler.dto';
import { JiraService } from '../jira/jira.service';
import { CreateJiraIssueResponseDto } from '../jira/dto/create-jira-issue-response.dto';
import { GetJiraIssueResponseDto } from '../jira/dto/get-jira-issue-response.dto';
import { ConfigService } from '../config/config.service';
import { Logger } from 'winston';

@Injectable()
export class PipelineRequestsService {
  constructor(
    private jiraService: JiraService,
    private configService: ConfigService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async findAll(
    filterDto: GetPipelineRequestFilterDto,
  ): Promise<PipelineRequest[]> {
    this.logger.debug(
      `Retrieving all pipeline requests with status: ${filterDto.status}.`,
      { label: 'PipelineRequestsService : findAll', filter: filterDto },
    );
    /* Query Jira via JiraService library */
    const jqlQuery = `project+%3D+PIPEREQ+AND+issuetype+%3D+Task+AND+status+%3D+"${
      filterDto.status
    }"+ORDER+BY+created+DESC`;
    const jiraIssues: GetJiraIssueResponseDto[] = await this.jiraService.getIssues(
      jqlQuery,
    );
    /* Make PipelineRequest object */
    const pipelineRequests: PipelineRequest[] = jiraIssues.map(issue => {
      return this.makePipelineRequest(issue);
    });

    this.logger.debug(
      `Retrieved pipeline requests with status: ${filterDto.status}.`,
      {
        label: 'PipelineRequestsService : findAll',
        filter: filterDto,
        results: pipelineRequests,
      },
    );

    return pipelineRequests;
  }

  async findOne(id: string): Promise<PipelineRequest> {
    let jiraIssue: GetJiraIssueResponseDto;
    this.logger.debug(`Retrieving pipeline request with id: ${id}`, {
      label: 'PipelineRequestsService : findOne',
    });
    /* Query Jira via JiraService library */
    try {
      jiraIssue = await this.jiraService.getIssueById(id);
    } catch (error) {
      if (!jiraIssue) {
        const message = `Pipeline request with ID "${id}" was not found.`;
        this.logger.warn(message);
        throw new NotFoundException(message);
      }
    }
    /* Make PipelineRequest object */
    const pipelineRequest: PipelineRequest = this.makePipelineRequest(
      jiraIssue,
    );

    this.logger.debug(`Retrieved pipeline request with id: ${id}`, {
      label: 'PipelineRequestsService : findOne',
      result: pipelineRequest,
    });
    return pipelineRequest;
  }

  async createRequest(createRequestDto: CreatePipelineRequestDto) {
    this.logger.debug(
      `Creating pipeline request for project: ${createRequestDto.projectName}`,
      {
        label: 'PipelineRequestsService : createRequest',
        project: createRequestDto,
      },
    );

    /* Create Jira issue representing PipelineRequest. */
    const createJiraIssueRes: CreateJiraIssueResponseDto = await this.jiraService.createIssue(
      this.configService.jiraPipelineRequestSummaryText, //summary
      JSON.stringify(createRequestDto), //description
      this.configService.jiraPipelineRequestIssueType, //issueType
      this.configService.jiraIssueRepositoryKey, //jiraProjectKey
    );

    /* Get pipeline request that was created. */
    const jiraIssue: GetJiraIssueResponseDto = await this.jiraService.getIssueById(
      createJiraIssueRes.key,
    );

    /* Make PipelineRequest object */
    const pipelineRequest: PipelineRequest = this.makePipelineRequest(
      jiraIssue,
    );

    this.logger.debug(
      `Created pipeline request for project: ${createRequestDto.projectName}`,
      {
        label: 'PipelineRequestsService : createRequest',
        project: createRequestDto,
      },
    );
    return pipelineRequest;
  }

  private makePipelineRequest(jiraIssue): PipelineRequest {
    const { key, fields } = jiraIssue;
    return {
      id: key,
      created: fields.created,
      status: fields.status.name,
      requestor: fields.reporter.displayName,
      ...JSON.parse(fields.description),
    };
  }
}
