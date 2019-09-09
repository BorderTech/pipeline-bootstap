import { Injectable, NotFoundException } from '@nestjs/common';
import { PipelineRequest } from './pipeline-request.model';
import { CreatePipelineRequestDto } from './dtos/create-pipeline-request.dto';
import { GetPipelineRequestFilterDto } from './dtos/get-pipeline-requests-fitler.dto';
import { JiraService } from '../jira/jira.service';
import { CreateJiraIssueResponseDto } from '../jira/dto/create-jira-issue-response.dto';

@Injectable()
export class PipelineRequestsService {
  constructor(private jiraService: JiraService) {}

  async findAll(
    filterDto: GetPipelineRequestFilterDto,
  ): Promise<PipelineRequest[]> {
    const jiraIssues = await this.jiraService.getPipelineRequestIssues(
      filterDto,
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
    return pipelineRequests;
  }

  async findOne(id: string): Promise<PipelineRequest> {
    const jiraIssue = await this.jiraService.getPipelineRequestIssue(id);
    if (!jiraIssue) {
      throw new NotFoundException(
        `Pipeline Request with ID "${id}" was not found.`,
      );
    }
    const { key, fields } = jiraIssue;
    const pipelineRequest: PipelineRequest = {
      id: key,
      created: fields.created,
      status: fields.status.name,
      requestor: fields.reporter.displayName,
      ...JSON.parse(fields.description),
    };
    return pipelineRequest;
  }

  async createRequest(createRequestDto: CreatePipelineRequestDto) {
    // Create the pipeline request
    const createJiraIssueRes: CreateJiraIssueResponseDto = await this.jiraService.createPipelineRequestIssue(
      createRequestDto,
    );
    // Get pipeline request that was created.
    const jiraIssue = await this.jiraService.getPipelineRequestIssue(
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
    return pipelineRequest;
  }
}
