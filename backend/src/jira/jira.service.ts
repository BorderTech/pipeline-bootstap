import {
  Injectable,
  HttpService,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { JiraProjectTemplateKey } from './jira-project-template-key.enum';
import { CreatePipelineRequestDto } from '../pipeline-requests/dtos/create-pipeline-request.dto';
import { CreateJiraIssueResponseDto } from './dto/create-jira-issue-response.dto';
import { GetJiraIssueResponseDto } from './dto/get-jira-issue-response.dto';
import { CreateJiraProjectRequestDto } from './dto/create-jira-project-request.dto';
import { CreateJiraProjectResponseDto } from './dto/create-jira-project-response.dto';
import { CreatePipelineDto } from './../pipelines/dtos/create-pipeline.dto';
import { GetJiraProjectResponseDto } from './dto/get-jira-project-response.dto';
import { AddActorsJiraProjectResponseDto } from './dto/add-actors-jira-project-response.dto';
import { handleAxiosError } from '../common/errors/axios-error-handler';
import { GetJiraIssueTransitionsDto } from './dto/get-jira-issue-transitions-response.dto';
import { ConfigService } from '../config/config.service';
import { CreateJiraIssueRequestDto } from './dto/create-jira-issue-request.dto';
import { Logger } from 'winston';

@Injectable()
export class JiraService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async getIssues(jqlQuery: string): Promise<GetJiraIssueResponseDto[]> {
    try {
      this.logger.debug(`Retrieving Jira with jql search query.`, {
        label: 'JiraService : getIssues',
        query: jqlQuery,
      });

      const data = await this.httpService
        .get(`/search?jql=${jqlQuery}`)
        .pipe(map(response => response.data.issues))
        .toPromise();

      this.logger.debug(`Retrieved Jira issues from jql search query.`, {
        label: 'JiraService : getIssues',
        query: jqlQuery,
        results: data,
      });

      return data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async getIssueById(id: string): Promise<GetJiraIssueResponseDto> {
    try {
      this.logger.debug(`Retrieving Jira issue with id: ${id}`, {
        label: 'JiraService : getIssueById',
      });

      const data = await this.httpService
        .get(`/issue/${id}`)
        .pipe(map(response => response.data))
        .toPromise();

      this.logger.debug(`Retrieved Jira issue with id: ${id}`, {
        label: 'JiraService : getIssueById',
        result: data,
      });

      return data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async createIssue(
    summary: string,
    description: string,
    issueType: string,
    jiraProjectKey: string,
  ): Promise<CreateJiraIssueResponseDto> {
    try {
      const createJiraIssueRequestDto: CreateJiraIssueRequestDto = this.makeCreateJiraIssueRequestDto(
        summary,
        description,
        issueType,
        jiraProjectKey,
      );

      this.logger.debug(
        `Creating Jira issue in Jira project: ${jiraProjectKey}`,
        {
          label: 'JiraService : createIssue',
          issue: createJiraIssueRequestDto,
        },
      );

      const data: CreateJiraIssueResponseDto = await this.httpService
        .post(`/issue`, createJiraIssueRequestDto)
        .pipe(map(response => response.data))
        .toPromise();

      this.logger.debug(
        `Created Jira issue id: ${data.key} in Jira project: ${jiraProjectKey}`,
        {
          label: 'JiraService : createIssue',
          issue: data,
        },
      );

      return data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async getProjectById(
    projectIdOrKey: string,
  ): Promise<GetJiraProjectResponseDto> {
    try {
      this.logger.debug(`Retrieving Jira project id: ${projectIdOrKey}`, {
        label: 'JiraService : getProjectById',
      });

      const data = await this.httpService
        .get(`/project/${projectIdOrKey}`)
        .pipe(map(response => response.data))
        .toPromise();

      this.logger.debug(`Retrieved Jira project: ${projectIdOrKey}`, {
        label: 'JiraService : getProjectById',
        project: data,
      });
      return data;
    } catch (error) {
      handleAxiosError(error);
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
      this.logger.debug(
        `Creating Jira project for ${createJiraProjectRequestDto.name}.`,
        {
          label: 'JiraService : createProject',
          project: createJiraProjectRequestDto,
        },
      );

      /* Create Jira project */
      createJiraProjectResponseDto = await this.httpService
        .post(`/project`, createJiraProjectRequestDto)
        .pipe(map(response => response.data))
        .toPromise();

      /* Optionally add administrators to project */
      if (createPipelineDto.projectTechLead) {
        addActorsJiraProjectResponseDto = await this.addAdministratorsToProject(
          createJiraProjectResponseDto.key,
          createPipelineDto.projectTechLead,
        );
      }

      this.logger.debug(
        `Created Jira project: ${createJiraProjectResponseDto.key} for ${
          createJiraProjectRequestDto.name
        }.`,
        {
          label: 'JiraService : createProject',
          project: createJiraProjectResponseDto,
        },
      );
    } catch (error) {
      handleAxiosError(error);
    }
    // Return the created project
    // NOTE: Does not return administrators created
    return await this.getProjectById(createJiraProjectResponseDto.key);
  }

  async deleteProject(projectIdOrKey: string) {
    try {
      // this.logger.verbose(`Deleting project: ${projectIdOrKey}`);
      const data = await this.httpService
        .delete(`/project/${projectIdOrKey}`)
        .pipe(map(response => response.data))
        .toPromise();
      // this.logger.verbose(`Deleted project: ${projectIdOrKey}`);
      return data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  /* Private / Helper Functions */
  async transitionIssueToDone(issueIdOrKey: string) {
    try {
      const getIssueTransitionsDto: GetJiraIssueTransitionsDto = await this.getIssueTransitions(
        issueIdOrKey,
      );

      const doneTransition = getIssueTransitionsDto.transitions.find(
        transition => transition.name === this.configService.jiraIssueDoneLabel,
      );

      if (doneTransition) {
        this.logger.debug(`Transitioning issue id: ${issueIdOrKey} to Done.`, {
          label: 'JiraService : transitionIssueToDone',
        });

        const transition = await this.httpService
          .post(`/issue/${issueIdOrKey}/transitions`, {
            transition: {
              id: doneTransition.id,
            },
          })
          .pipe(map(response => response.data))
          .toPromise();

        this.logger.debug(`Transitioned issue id: ${issueIdOrKey} to Done.`, {
          label: 'JiraService : transitionIssueToDone',
        });

        console.log(transition);
        return transition;
      } else {
        this.logger.warn(
          `Unable to transition to Done. Transition not found for issue id: ${issueIdOrKey}`,
          { label: 'JiraService : transitionIssueToDone' },
        );
      }
    } catch (error) {
      handleAxiosError(error);
    }
  }

  private async getIssueTransitions(
    issueIdOrKey: string,
  ): Promise<GetJiraIssueTransitionsDto> {
    this.logger.debug(
      `Retrieving issue transition options for issue id: ${issueIdOrKey}`,
      { label: 'JiraService getIssueTransitions: getIssueTransitions' },
    );
    try {
      const jiraIssueTransitions: GetJiraIssueTransitionsDto = await this.httpService
        .get(`/issue/${issueIdOrKey}/transitions`)
        .pipe(map(response => response.data))
        .toPromise();

      this.logger.debug(
        `Retrieved issue transition options for issue id: ${issueIdOrKey}`,
        {
          label: 'JiraService getIssueTransitions: getIssueTransitions',
          issueTransitions: jiraIssueTransitions,
        },
      );
      return jiraIssueTransitions;
    } catch (error) {
      handleAxiosError(error);
    }
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
    // this.logger.verbose(
    //   `Adding administrators Jira Project: ${projectId}. Administrators: ${JSON.stringify(
    //     administrators,
    //   )}`,
    // );
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

        // this.logger.verbose(
        //   `Added administrators to Jira Project: ${projectId}. Data: ${JSON.stringify(
        //     addActorsJiraProjectRoleResponseDto,
        //   )}`,
        // );
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

  private makeCreateJiraIssueRequestDto(
    summary: string,
    description: string,
    issueType: string,
    jiraProjectKey: string,
  ): CreateJiraIssueRequestDto {
    return {
      fields: {
        project: {
          key: jiraProjectKey,
        },
        summary: summary,
        description: description,
        issuetype: {
          name: issueType,
        },
      },
    };
  }
}
