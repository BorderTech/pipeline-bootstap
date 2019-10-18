import { Test, TestingModule } from '@nestjs/testing';
import { PipelineRequestsService } from './pipeline-requests.service';
import { GetPipelineRequestFilterDto } from './dtos/get-pipeline-requests-fitler.dto';
import { JiraService } from '../jira/jira.service';
import { CreatePipelineRequestDto } from './dtos/create-pipeline-request.dto';
import { PipelineRequest } from './pipeline-request.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PipelineRequestStatus } from './pipeline-request-status.enum';
import { ConfigService } from '../config/config.service';
import * as path from 'path';
import { CreateJiraIssueResponseDto } from '../jira/dto/create-jira-issue-response.dto';

export type MockType<T> = { [P in keyof T]: jest.Mock<{}> };
// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn(entity => entity),
    find: jest.fn(entity => entity),
    save: jest.fn(entity => entity),
  }),
);

describe('PipelineRequestsService', () => {
  let service: PipelineRequestsService;
  let repositoryMock: MockType<Repository<PipelineRequest>>;

  beforeAll(async () => {
    const JiraServiceProvider = {
      provide: JiraService,
      useClass: JiraServiceMock,
    };

    const envFilePath = path.join(__dirname, `../../.env.example`);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PipelineRequestsService,
        {
          provide: 'winston',
          useFactory: () => require('winston'),
        },
        {
          provide: ConfigService,
          useValue: new ConfigService(envFilePath),
        },
        JiraServiceProvider,
        {
          provide: getRepositoryToken(PipelineRequest),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    service = module.get<PipelineRequestsService>(PipelineRequestsService);
    repositoryMock = module.get(getRepositoryToken(PipelineRequest));
  });

  describe('findAll', () => {
    it('should get an array of PipelineRequest', async () => {
      let filterDto: GetPipelineRequestFilterDto = new GetPipelineRequestFilterDto();
      filterDto.status = PipelineRequestStatus.TODO;
      const pipelineRequests: PipelineRequest[] = [
        {
          id: 1,
          requestor: 'Joe Citizen',
          projectType: 'software',
          projectName: 'My First Project',
          projectDescription: 'Coolest project ever!',
          projectLead: 'ABC124',
          softwareMetadata: {
            id: 1,
            projectTechLead: ['ABC144', 'GFD222'],
            language: 'Java',
            kanbanBoardRequired: true,
            pipelineRequest: null,
          },
          businessMetadata: null,
          orgUnit: 'Some business unit',
          wbsCode: '11111',
          status: 'To Do',
          created: new Date(),
          jiraIssueUrl: 'www.example.com/jira-id',
        },
      ];

      repositoryMock.find.mockReturnValue(pipelineRequests);
      expect(await service.findAll(filterDto)).toStrictEqual(pipelineRequests);
      expect(repositoryMock.find).toHaveBeenCalledWith({
        where: { status: filterDto.status },
        relations: ['businessMetadata', 'softwareMetadata'],
      });
    });
  });

  describe('findOne', () => {
    it('should get a PipelineRequest matching id', async () => {
      const pipelineRequest: PipelineRequest = {
        id: 1,
        requestor: 'Joe Citizen',
        projectType: 'software',
        projectName: 'My First Project',
        projectDescription: 'Coolest project ever!',
        projectLead: 'ABC124',
        softwareMetadata: {
          id: 1,
          projectTechLead: ['ABC144', 'GFD222'],
          language: 'Java',
          kanbanBoardRequired: true,
          pipelineRequest: null,
        },
        businessMetadata: null,
        orgUnit: 'Some business unit',
        wbsCode: '11111',
        status: 'To Do',
        created: new Date(),
        jiraIssueUrl: 'www.example.com/jira-id',
      };

      repositoryMock.findOne.mockReturnValue(pipelineRequest);
      expect(await service.findOne(pipelineRequest.id)).toEqual(
        pipelineRequest,
      );
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        relations: ['businessMetadata', 'softwareMetadata'],
        where: { id: 1 },
      });
    });
  });

  describe('createRequest', () => {
    it('should return a created PipelineRequest', async () => {
      const request: CreatePipelineRequestDto = {
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
      const pipelineRequest: PipelineRequest = {
        id: 1,
        requestor: 'Joe Citizen',
        projectType: 'software',
        projectName: 'My First Project',
        projectDescription: 'Coolest project ever!',
        projectLead: 'ABC124',
        // @ts-ignore
        softwareMetadata: {
          id: 1,
          projectTechLead: ['ABC144', 'GFD222'],
          language: 'Java',
          kanbanBoardRequired: true,
        },
        businessMetadata: null,
        orgUnit: 'Some business unit',
        wbsCode: '11111',
        status: 'To Do',
        created: new Date(),
      };

      repositoryMock.save.mockReturnValue(pipelineRequest);

      expect(await service.createRequest(request)).toStrictEqual(
        pipelineRequest,
      );
    });
  });
});

class JiraServiceMock {
  async createIssue(
    reporter: string,
    summary: string,
    description: string,
    issueType: string,
    jiraProjectKey: string,
  ): Promise<CreateJiraIssueResponseDto> {
    return {
      id: 'PIPEREQ-1',
      key: 'PIPEREQ-1',
      self: 'www.example.com/jira-issue',
    };
  }
}
