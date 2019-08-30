import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { CreatePipelineRequestDto } from '../pipeline-requests/dtos/create-pipeline-request.dto';
import { CreateJiraIssueResponse } from './dto/create-jira-issue-response.dto';
import { GetPipelineRequestFilterDto } from '../pipeline-requests/dtos/get-pipeline-requests-fitler.dto';

@Injectable()
export class JiraService {
  constructor(private readonly httpService: HttpService) {}
  getMyPermissions() {
    return this.httpService
      .get('/mypermissions')
      .pipe(map(response => response.data));
  }

  getPipelineRequestIssues(filterDto: GetPipelineRequestFilterDto) {
    const { status } = filterDto;
    const query = `project+%3D+PIPEREQ+AND+issuetype+%3D+Task+AND+status+%3D+"${status}"+ORDER+BY+created+DESC`;
    return this.httpService
      .get(`/search?jql=${query}`)
      .pipe(map(response => response.data.issues))
      .toPromise();
  }

  async getPipelineRequestIssue(id: string) {
    return this.httpService
      .get(`/issue/${id}`)
      .pipe(map(response => response.data))
      .toPromise();
  }

  async createPipelineRequestIssue(
    createRequestDto: CreatePipelineRequestDto,
  ): Promise<CreateJiraIssueResponse> {
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
