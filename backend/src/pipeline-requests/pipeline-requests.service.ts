import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PipelineRequest } from './pipeline-request.model';
import { CreatePipelineRequestDto } from './dtos/create-pipeline-request.dto';
import { GetPipelineRequestFilterDto } from './dtos/get-pipeline-requests-fitler.dto';
import { JiraService } from '../jira/jira.service';
import { CreateJiraIssueResponseDto } from '../jira/dto/create-jira-issue-response.dto';
import { GetJiraIssueResponseDto } from '../jira/dto/get-jira-issue-response.dto';
import { ConfigService } from '../config/config.service';

@Injectable()
export class PipelineRequestsService {
  private logger = new Logger('PipelineRequestsService');

  constructor(
    private jiraService: JiraService,
    private configService: ConfigService,
  ) {}

  async findAll(
    filterDto: GetPipelineRequestFilterDto,
  ): Promise<PipelineRequest[]> {
    this.logger.verbose(
      `Retrieving all pipeline requests. Filters: ${JSON.stringify(filterDto)}`,
    );
    const jqlQuery = `project+%3D+PIPEREQ+AND+issuetype+%3D+Task+AND+status+%3D+"${
      filterDto.status
    }"+ORDER+BY+created+DESC`;
    const jiraIssues: GetJiraIssueResponseDto[] = await this.jiraService.getIssues(
      jqlQuery,
    );
    const pipelineRequests: PipelineRequest[] = jiraIssues.map(issue => {
      return {
        id: issue.key,
        created: issue.fields.created,
        status: issue.fields.status.name,
        requestor: issue.fields.reporter.displayName,
        ...JSON.parse(issue.fields.description),
      };
    });
    this.logger.verbose(
      `Retrieved pipeline requests. Filters: ${filterDto}. Data: ${JSON.stringify(
        pipelineRequests,
      )}`,
    );
    return pipelineRequests;
  }

  async findOne(id: string): Promise<PipelineRequest> {
    let jiraIssue: GetJiraIssueResponseDto;
    this.logger.verbose(`Retrieving pipeline request. Id: ${id}`);
    try {
      jiraIssue = await this.jiraService.getIssueById(id);
    } catch (error) {
      if (!jiraIssue) {
        const message = `Pipeline request with ID "${id}" was not found.`;
        this.logger.warn(message);
        throw new NotFoundException(message);
      }
    }
    const { key, fields } = jiraIssue;
    const pipelineRequest: PipelineRequest = {
      id: key,
      created: fields.created,
      status: fields.status.name,
      requestor: fields.reporter.displayName,
      ...JSON.parse(fields.description),
    };
    this.logger.verbose(
      `Retrieved pipeline request. ID: ${id} Data: ${JSON.stringify(
        pipelineRequest,
      )}`,
    );
    return pipelineRequest;
  }

  async createRequest(createRequestDto: CreatePipelineRequestDto) {
    // Create the pipeline request
    this.logger.verbose(
      `Creating pipeline request. Data: ${JSON.stringify(createRequestDto)}`,
    );
    const createJiraIssueRes: CreateJiraIssueResponseDto = await this.jiraService.createIssue(
      this.configService.jiraPipelineRequestSummaryText, //summary
      JSON.stringify(createRequestDto), //description
      this.configService.jiraPipelineRequestIssueType, //issueType
      this.configService.jiraIssueRepositoryKey, //jiraProjectKey
    );
    // Get pipeline request that was created.
    const jiraIssue: GetJiraIssueResponseDto = await this.jiraService.getIssueById(
      createJiraIssueRes.key,
    );
    const { key, fields } = jiraIssue;
    const pipelineRequest: PipelineRequest = {
      id: key,
      created: fields.created,
      status: fields.status.name,
      requestor: fields.reporter.displayName,
      ...JSON.parse(fields.description),
    };
    this.logger.verbose(
      `Created pipeline request. Data ${JSON.stringify(pipelineRequest)}`,
    );
    return pipelineRequest;
  }
}
