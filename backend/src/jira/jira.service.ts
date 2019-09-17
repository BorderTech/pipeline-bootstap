import {
  Injectable,
  HttpService,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { JiraProjectTemplateKey } from './jira-project-template-key.enum';
import { CreatePipelineRequestDto } from '../pipeline-requests/dtos/create-pipeline-request.dto';
import { CreateJiraIssueResponseDto } from './dto/create-jira-issue-response.dto';
import { GetPipelineRequestFilterDto } from '../pipeline-requests/dtos/get-pipeline-requests-fitler.dto';
import { GetJiraIssueResponseDto } from './dto/get-jira-issue-response.dto';
import { CreateJiraProjectRequestDto } from './dto/create-jira-project-request.dto';
import { CreateJiraProjectResponseDto } from './dto/create-jira-project-response.dto';
import { CreatePipelineDto } from './../pipelines/dtos/create-pipeline.dto';
import { GetJiraProjectResponseDto } from './dto/get-jira-project-response.dto';
import { AddActorsJiraProjectResponseDto } from './dto/add-actors-jira-project-response.dto';

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

  getIssuesMatchingJql(query: string): Promise<GetJiraIssueResponseDto[]> {
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

  async getProject(id: string): Promise<GetJiraProjectResponseDto> {
    try {
      const response = await this.httpService.get(`/project/${id}`).toPromise();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async createProject(
    createPipelineDto: CreatePipelineDto,
  ): Promise<GetJiraProjectResponseDto> {
    let createJiraProjectResponseDto: CreateJiraProjectResponseDto;
    let addActorsJiraProjectResponseDto: AddActorsJiraProjectResponseDto;
    const createJiraProjectRequestDto = this.makeCreateJiraProjectRequestDto(
      createPipelineDto,
    );
    try {
      // Await initial project creation
      createJiraProjectResponseDto = await this.httpService
        .post(`/project`, createJiraProjectRequestDto)
        .pipe(map(response => response.data))
        .toPromise();
      // Optionally add administrators to project
      if (createPipelineDto.projectTechLead) {
        addActorsJiraProjectResponseDto = await this.addAdministratorsToProject(
          createJiraProjectResponseDto.key,
          createPipelineDto.projectTechLead,
        );
      }
    } catch (error) {
      // console.log(error);
      if (error.response.data) {
        console.log(error.response.data);
        if (error.response.status === 400) {
          const errorMessage = { jira: error.response.data };
          throw new BadRequestException(errorMessage);
        }
      } else {
        // We malfunctioned somehow - not the users fault
        throw new InternalServerErrorException(error);
      }
    }
    // Return the created project
    // NOTE: Does not return administrators created
    return await this.getProject(createJiraProjectResponseDto.key);
  }

  private async getProjectRoles(projectId: string) {
    try {
      const projectRoles = await this.httpService
        .get(`/project/${projectId}/role`)
        .pipe(map(response => response.data))
        .toPromise();
      return projectRoles;
    } catch (error) {
      console.log(
        `Error getting project roles of projectId:${projectId}`,
        error,
      );
      throw new InternalServerErrorException(error);
    }
  }

  private async addAdministratorsToProject(
    projectId: string,
    administrators: string[],
  ): Promise<AddActorsJiraProjectResponseDto> {
    // Get the ID of Administrators role of the created project
    const projectRoles = await this.getProjectRoles(projectId);

    // Check if the administrator role exists
    // It should - unless defaults are changed in Jira
    if (projectRoles.Administrators) {
      //Extract the roleID from the administrators API url returned
      const urlParts = projectRoles.Administrators.split('/');
      const roleId = urlParts[urlParts.length - 1];
      try {
        const addActorsJiraProjectRoleResponseDto = await this.httpService
          .post(`/project/${projectId}/role/${roleId}`, {
            user: administrators,
          })
          .pipe(map(response => response.data))
          .toPromise();

        return addActorsJiraProjectRoleResponseDto;
      } catch (error) {
        console.log(`Error adding admins to projectId: ${projectId}`, error);
        throw new InternalServerErrorException(error);
      }
    } else {
      // Throw an exception here if the project role does not exist
    }
  }

  private makeCreateJiraProjectRequestDto(
    createRequestDto: CreatePipelineRequestDto,
  ): CreateJiraProjectRequestDto {
    const createJiraProjectRequestDto: CreateJiraProjectRequestDto = {
      key: this.generateProjectKey(createRequestDto.projectName),
      name: createRequestDto.projectName,
      projectTypeKey: createRequestDto.projectType,
      projectTemplateKey: this.generateProjectTemplateKey(
        createRequestDto.projectType,
        createRequestDto.kanbanBoardRequired,
        createRequestDto.projectManagementRequired,
      ),
      description: createRequestDto.projectDescription,
      lead: createRequestDto.projectLead,
      assigneeType: 'PROJECT_LEAD',
    };
    return createJiraProjectRequestDto;
  }

  private generateProjectTemplateKey(
    projectType,
    kanbanBoardRequired,
    projectManagementRequired,
  ) {
    if (projectType === 'software') {
      if (kanbanBoardRequired) {
        return JiraProjectTemplateKey.KANBAN;
      } else {
        return JiraProjectTemplateKey.SCRUM;
      }
    } else if (projectType === 'business') {
      if (projectManagementRequired) {
        return JiraProjectTemplateKey.PROJECT_MANAGEMENT;
      } else {
        return JiraProjectTemplateKey.TASK_MANAGEMENT;
      }
    }
  }

  private generateProjectKey(projectName: string): string {
    let projectKey: string = '';
    // Handling accented characters that WILL cause issues for Atlassian products
    const normalizedProjectName: string = projectName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const words: string[] = normalizedProjectName.trim().split(' ');

    if (words.length > 1) {
      words.forEach(word => {
        let character = word[0];
        if (this.isLetter(character)) {
          projectKey += word[0].toUpperCase();
          projectKey = projectKey.substring(0, 10);
        }
      });
    } else {
      projectKey = normalizedProjectName.substring(0, 10).toUpperCase();
    }
    return projectKey;
  }

  private isLetter(str: String) {
    return str.length === 1 && str.match(/[a-z]/i);
  }
}
