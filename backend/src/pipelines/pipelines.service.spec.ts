import { Test, TestingModule } from '@nestjs/testing';
import { PipelinesService } from './pipelines.service';
import * as path from 'path';
import { ConfigService } from '../config/config.service';
import { JiraService } from '../jira/jira.service';
import { ConfluenceService } from '../confluence/confluence.service';
import { JenkinsService } from '../jenkins/jenkins.service';
import { BitbucketService } from '../bitbucket/bitbucket.service';
import { GetJiraProjectResponseDto } from '../jira/dto/get-jira-project-response.dto';
import { CreatePipelineDto } from './dtos/create-pipeline.dto';
import { Repository } from 'typeorm';
import { CreateConfluenceSpaceResponseDto } from '../confluence/dto/create-confluence-space-response.dto';
import { CreateBitbucketRepositoryResponseDto } from '../bitbucket/dto/create-bitbucket-repository-reponse.dto';
import { CreateJenkinsResponseDto } from '../jenkins/dto/create-jenkins-job-response.dto';
import { PipelineRequest } from '../pipeline-requests/pipeline-request.entity';
import { Pipeline } from './pipeline.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PipelineRequestsService } from '../pipeline-requests/pipeline-requests.service';

export type MockType<T> = { [P in keyof T]: jest.Mock<{}> };
// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn(entity => entity),
    find: jest.fn(entity => entity),
    save: jest.fn(entity => entity),
  }),
);

describe('PipelinesService', () => {
  let service: PipelinesService;
  let configService: ConfigService;
  let repositoryMock: MockType<Repository<Pipeline>>;

  beforeEach(async () => {
    const JiraServiceProvider = {
      provide: JiraService,
      useClass: JiraServiceMock,
    };
    const ConfluenceServiceProvider = {
      provide: ConfluenceService,
      useClass: ConfluenceServiceMock,
    };
    const BitbucketServiceProvider = {
      provide: BitbucketService,
      useClass: BitbucketServiceMock,
    };
    const JenkinsServiceProvider = {
      provide: JenkinsService,
      useClass: JenkinsServiceMock,
    };
    const PipelineRequestServiceProvider = {
      provide: PipelineRequestsService,
      useClass: PipelineRequestServiceMock,
    };
    const envFilePath = path.join(__dirname, `../../.env.example`);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PipelinesService,
        JiraServiceProvider,
        ConfluenceServiceProvider,
        BitbucketServiceProvider,
        JenkinsServiceProvider,
        PipelineRequestServiceProvider,
        {
          provide: ConfigService,
          useValue: new ConfigService(envFilePath),
        },
        {
          provide: 'winston',
          useFactory: () => require('winston'),
        },
        {
          provide: getRepositoryToken(Pipeline),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<PipelinesService>(PipelinesService);
    configService = module.get<ConfigService>(ConfigService);
    repositoryMock = module.get(getRepositoryToken(Pipeline));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPipeline', () => {
    it('should return create pipeline artifacts in shape of CreatePipelineResponseDto', async () => {
      const createPipeline: CreatePipelineDto = {
        requestId: 1,
        requestor: 'Joe Citizen',
        projectType: 'software',
        projectName: 'My First Project',
        projectDescription: 'Coolest project ever!',
        projectLead: 'ABC124',
        orgUnit: 'Some business unit',
        wbsCode: '11111',
        softwareMetadata: {
          projectTechLead: ['ABC144', 'GFD222'],
          language: 'Java',
          kanbanBoardRequired: true,
        },
        businessMetadata: null,
      };
      const expected = {
        name: 'PIPEREQ Example Proj',
        artefacts: [
          {
            type: 'JIRA',
            key: 'PEP',
            name: 'PIPEREQ Example Proj',
            url: 'https://jira.example.com/projects/PEP',
            id: 1,
            pipeline: null,
          },
          {
            type: 'CONFLUENCE',
            key: 'PEP',
            name: 'PIPEREQ Example Proj',
            url: 'https://confluence.example.com/display/PEP',
            id: 2,
            pipeline: null,
          },
          {
            type: 'BITBUCKET',
            key: 'pipereq-example-proj',
            name: 'PIPEREQ Example Proj',
            url:
              'https://bitbucket.example.com/projects/REPO/repos/pipereq-example-proj',
            id: 3,
            pipeline: null,
          },
          {
            type: 'JENKINS',
            key: 'pipereq-example-proj',
            name: 'pipereq-example-proj',
            url: 'https://jenkins.example.com/jenkins/job/pipereq-example-proj',
            id: 4,
            pipeline: null,
          },
        ],
        id: 1,
      };

      const pipeline: Pipeline = {
        name: 'PIPEREQ Example Proj',
        artefacts: [
          {
            type: 'JIRA',
            key: 'PEP',
            name: 'PIPEREQ Example Proj',
            url: 'https://jira.example.com/projects/PEP',
            id: 1,
            pipeline: null,
          },
          {
            type: 'CONFLUENCE',
            key: 'PEP',
            name: 'PIPEREQ Example Proj',
            url: 'https://confluence.example.com/display/PEP',
            id: 2,
            pipeline: null,
          },
          {
            type: 'BITBUCKET',
            key: 'pipereq-example-proj',
            name: 'PIPEREQ Example Proj',
            url:
              'https://bitbucket.example.com/projects/REPO/repos/pipereq-example-proj',
            id: 3,
            pipeline: null,
          },
          {
            type: 'JENKINS',
            key: 'pipereq-example-proj',
            name: 'pipereq-example-proj',
            url: 'https://jenkins.example.com/jenkins/job/pipereq-example-proj',
            id: 4,
            pipeline: null,
          },
        ],
        id: 1,
      };

      repositoryMock.save.mockReturnValue(pipeline);
      expect(await service.createPipeline(createPipeline)).toStrictEqual(
        expected,
      );
    });
  });
});

class JiraServiceMock {
  async createProject(
    createPipelineDto: CreatePipelineDto,
  ): Promise<GetJiraProjectResponseDto> {
    return {
      expand: 'description,lead,url,projectKeys',
      self: 'http://www.example.com/jira/rest/api/2/project/EX',
      id: '10000',
      key: 'EX',
      description: 'This project was created as an example for REST.',
      lead: {
        self: 'http://www.example.com/jira/rest/api/2/user?username=fred',
        name: 'fred',
        avatarUrls: {
          '48x48':
            'http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred',
          '24x24':
            'http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred',
          '16x16':
            'http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred',
          '32x32':
            'http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred',
        },
        displayName: 'Fred F. User',
        active: true,
      },
      components: [
        {
          self: 'http://www.example.com/jira/rest/api/2/component/10000',
          id: '10000',
          name: 'Component 1',
          description: 'This is a JIRA component',
          lead: {
            self: 'http://www.example.com/jira/rest/api/2/user?username=fred',
            name: 'fred',
            avatarUrls: {
              '48x48':
                'http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred',
              '24x24':
                'http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred',
              '16x16':
                'http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred',
              '32x32':
                'http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred',
            },
            displayName: 'Fred F. User',
            active: true,
          },
          assigneeType: 'PROJECT_LEAD',
          assignee: {
            self: 'http://www.example.com/jira/rest/api/2/user?username=fred',
            name: 'fred',
            avatarUrls: {
              '48x48':
                'http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred',
              '24x24':
                'http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred',
              '16x16':
                'http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred',
              '32x32':
                'http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred',
            },
            displayName: 'Fred F. User',
            active: true,
          },
          realAssigneeType: 'PROJECT_LEAD',
          realAssignee: {
            self: 'http://www.example.com/jira/rest/api/2/user?username=fred',
            name: 'fred',
            avatarUrls: {
              '48x48':
                'http://www.example.com/jira/secure/useravatar?size=large&ownerId=fred',
              '24x24':
                'http://www.example.com/jira/secure/useravatar?size=small&ownerId=fred',
              '16x16':
                'http://www.example.com/jira/secure/useravatar?size=xsmall&ownerId=fred',
              '32x32':
                'http://www.example.com/jira/secure/useravatar?size=medium&ownerId=fred',
            },
            displayName: 'Fred F. User',
            active: true,
          },
          isAssigneeTypeValid: false,
          project: 'HSP',
          projectId: 10000,
        },
      ],
      issueTypes: [
        {
          self: 'http://localhost:8090/jira/rest/api/2.0/issueType/3',
          id: '3',
          description: 'A task that needs to be done.',
          iconUrl:
            'http://localhost:8090/jira/images/icons/issuetypes/task.png',
          name: 'Task',
          subtask: false,
          avatarId: 1,
        },
        {
          self: 'http://localhost:8090/jira/rest/api/2.0/issueType/1',
          id: '1',
          description: 'A problem with the software.',
          iconUrl: 'http://localhost:8090/jira/images/icons/issuetypes/bug.png',
          name: 'Bug',
          subtask: false,
          avatarId: 10002,
        },
      ],
      url: 'http://www.example.com/jira/browse/EX',
      email: 'from-jira@example.com',
      assigneeType: 'PROJECT_LEAD',
      versions: [],
      name: 'Example',
      roles: {
        Developers:
          'http://www.example.com/jira/rest/api/2/project/EX/role/10000',
      },
      avatarUrls: {
        '48x48':
          'http://www.example.com/jira/secure/projectavatar?size=large&pid=10000',
        '24x24':
          'http://www.example.com/jira/secure/projectavatar?size=small&pid=10000',
        '16x16':
          'http://www.example.com/jira/secure/projectavatar?size=xsmall&pid=10000',
        '32x32':
          'http://www.example.com/jira/secure/projectavatar?size=medium&pid=10000',
      },
      projectCategory: {
        self: 'http://www.example.com/jira/rest/api/2/projectCategory/10000',
        id: '10000',
        name: 'FIRST',
        description: 'First Project Category',
      },
      archived: false,
    };
  }
}

class ConfluenceServiceMock {
  async createSpace(
    createPipelineDto: CreatePipelineDto,
  ): Promise<CreateConfluenceSpaceResponseDto> {
    return {
      id: 11,
      key: 'EX',
      name: 'Example space',
      description: {
        plain: {
          value: 'This is an example space',
          representation: 'plain',
        },
      },
      metadata: {},
      _links: {
        collection: '/rest/api/space',
        base: `'http://example.com/confluence/'`,
        context: '/confluence',
        self: 'http://example.com/confluence/rest/api/space/TST',
      },
    };
  }
}

class BitbucketServiceMock {
  async createRepository(
    createPipelineDto: CreatePipelineDto,
  ): Promise<CreateBitbucketRepositoryResponseDto> {
    return {
      slug: 'my-repo',
      id: 1,
      name: 'My repo',
      description: 'My repo description',
      scmId: 'git',
      state: 'AVAILABLE',
      statusMessage: 'Available',
      forkable: true,
      project: {
        key: 'PRJ',
        id: 1,
        name: 'My Cool Project',
        description: 'The description for my cool project.',
        public: true,
        type: 'NORMAL',
        links: {
          self: [
            {
              href: 'http://link/to/project',
            },
          ],
        },
      },
      public: true,
      links: {
        clone: [
          {
            href: 'ssh://git@<baseURL>/PRJ/my-repo.git',
            name: 'ssh',
          },
          {
            href: 'https://<baseURL>/scm/PRJ/my-repo.git',
            name: 'http',
          },
        ],
        self: [
          {
            href: 'http://link/to/repository',
          },
        ],
      },
    };
  }
}

class JenkinsServiceMock {
  async copyJob(
    createPipelineDto: CreatePipelineDto,
  ): Promise<CreateJenkinsResponseDto> {
    return {
      name: 'my-job',
      url: 'http://jenkins.example.com/jenkins/job/my-job',
    };
  }
}

class PipelineRequestServiceMock {
  async findOne(id: number): Promise<PipelineRequest> {
    return {
      id: 1,
      requestor: 'ABC123',
      projectType: 'software',
      projectName: 'PIPEREQ Test Project',
      projectDescription: 'PIPEREQ Test Project',
      wbsCode: '11111',
      orgUnit: 'PIPEREQ Test Project',
      status: 'To Do',
      projectLead: 'ABC123',
      jiraIssueUrl: `https://jira.example.com/browse/PIPEREQ-1`,
      created: new Date(),
      businessMetadata: null,
      softwareMetadata: {
        id: 1,
        kanbanBoardRequired: true,
        projectTechLead: ['ABC123'],
        language: 'Java',
        pipelineRequest: null,
      },
    };
  }

  async updatePipelineRequestAsDone(id: number): Promise<PipelineRequest> {
    return {
      id: 1,
      requestor: 'ABC123',
      projectType: 'software',
      projectName: 'PIPEREQ Test Project',
      projectDescription: 'PIPEREQ Test Project',
      wbsCode: '11111',
      orgUnit: 'PIPEREQ Test Project',
      status: 'Done',
      projectLead: 'ABC123',
      jiraIssueUrl: `https://jira.example.com/browse/PIPEREQ-1`,
      created: new Date(),
      businessMetadata: null,
      softwareMetadata: {
        id: 1,
        kanbanBoardRequired: true,
        projectTechLead: ['ABC123'],
        language: 'Java',
        pipelineRequest: null,
      },
    };
  }
}
