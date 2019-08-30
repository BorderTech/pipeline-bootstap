import { Injectable, NotFoundException } from '@nestjs/common';
import { PipelineRequest } from './pipeline-request.model';
import { CreatePipelineRequestDto } from './dtos/create-pipeline-request.dto';
import { GetPipelineRequestFilterDto } from './dtos/get-pipeline-requests-fitler.dto';
import { JiraService } from '../jira/jira.service';
import { CreateJiraIssueResponse } from '../jira/dto/create-jira-issue-response.dto';

@Injectable()
export class PipelineRequestsService {
  constructor(private jiraService: JiraService) {}

  async getAllRequests(
    filterDto: GetPipelineRequestFilterDto,
  ): Promise<PipelineRequest[]> {
    const jiraIssues = await this.jiraService.getPipelineRequestIssues(
      filterDto,
    );
    const pipelineRequests: PipelineRequest[] = jiraIssues.map(issue => {
      return {
        id: issue.key,
        ...JSON.parse(issue.fields.description),
      };
    });
    return pipelineRequests;
  }

  async getRequestById(id: string): Promise<PipelineRequest> {
    // TODO: NotFoundException if not found
    const jiraIssue = await this.jiraService.getPipelineRequestIssue(id);
    const { key, fields } = jiraIssue;
    const pipelineRequest: PipelineRequest = {
      id: key,
      ...JSON.parse(fields.description),
    };
    return pipelineRequest;
  }

  async createRequest(createRequestDto: CreatePipelineRequestDto) {
    const createJiraIssueRes: CreateJiraIssueResponse = await this.jiraService.createPipelineRequestIssue(
      createRequestDto,
    );
    const pipelineRequest: PipelineRequest = {
      id: createJiraIssueRes.key,
      ...createRequestDto,
    };
    return pipelineRequest;
  }
}
