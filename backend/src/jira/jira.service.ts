import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { CreatePipelineRequestDto } from '../pipeline-requests/dtos/create-pipeline-request.dto';
import { CreateJiraIssueResponseDto } from './dto/create-jira-issue-response.dto';
import { GetPipelineRequestFilterDto } from '../pipeline-requests/dtos/get-pipeline-requests-fitler.dto';
import { GetJiraIssueResponseDto } from './dto/get-jira-issue-response.dto';

@Injectable()
export class JiraService {
  constructor(private readonly httpService: HttpService) {}
  getMyPermissions() {
    return this.httpService
      .get('/mypermissions')
      .pipe(map(response => response.data));
  }

  getPipelineRequestIssues(
    filterDto: GetPipelineRequestFilterDto,
  ): Promise<GetJiraIssueResponseDto[]> {
    const { status } = filterDto;
    const query = `project+%3D+PIPEREQ+AND+issuetype+%3D+Task+AND+status+%3D+"${status}"+ORDER+BY+created+DESC`;
    return this.httpService
      .get(`/search?jql=${query}`)
      .pipe(map(response => response.data.issues))
      .toPromise();
  }

  async getPipelineRequestIssue(id: string): Promise<GetJiraIssueResponseDto> {
    try {
      const response = await this.httpService.get(`/issue/${id}`).toPromise();
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  async createPipelineRequestIssue(
    createRequestDto: CreatePipelineRequestDto,
  ): Promise<CreateJiraIssueResponseDto> {
    const data = {
      fields: {
        project: {
          key: 'PIPEREQ',
        },
        summary: 'New pipeline request',
        description: JSON.stringify(createRequestDto),
        issuetype: {
          name: 'Task',
        },
      },
    };
    return await this.httpService
      .post(`/issue`, data)
      .pipe(map(response => response.data))
      .toPromise();
  }
}
