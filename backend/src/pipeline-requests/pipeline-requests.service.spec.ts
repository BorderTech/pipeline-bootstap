import { Test, TestingModule } from '@nestjs/testing';
import { PipelineRequestsService } from './pipeline-requests.service';
import { GetPipelineRequestFilterDto } from './dtos/get-pipeline-requests-fitler.dto';
import { JiraService } from '../jira/jira.service';
import { CreatePipelineRequestDto } from './dtos/create-pipeline-request.dto';

describe('PipelineRequestsService', () => {
  let app: TestingModule;
  let pipelineRequestsService: PipelineRequestsService;

  beforeAll(async () => {
    const JiraServiceProvider = {
      provide: JiraService,
      useClass: JiraServiceMock,
    };
    app = await Test.createTestingModule({
      providers: [PipelineRequestsService, JiraServiceProvider],
    }).compile();
    pipelineRequestsService = app.get<PipelineRequestsService>(
      PipelineRequestsService,
    );
  });

  describe('findAll', () => {
    it('should get an array of PipelineRequest', async () => {
      const filterDto: GetPipelineRequestFilterDto = new GetPipelineRequestFilterDto();
      const result = [
        {
          id: 'KEY',
          projectType: 'business',
          projectName: 'My First Project',
          projectDescription: 'Coolest project ever!',
          projectLead: 'ABC124',
          projectTechLead: 'ABC144,GFD222',
          orgUnit: 'Some business unit',
          wbsCode: '11111',
        },
      ];
      expect(await pipelineRequestsService.findAll(filterDto)).toStrictEqual(
        result,
      );
    });
  });

  describe('findOne', () => {
    it('should get a PipelineRequest matching id', async () => {
      const id = 'KEY';
      const result = {
        id: 'KEY',
        projectType: 'business',
        projectName: 'My First Project',
        projectDescription: 'Coolest project ever!',
        projectLead: 'ABC124',
        projectTechLead: 'ABC144,GFD222',
        orgUnit: 'Some business unit',
        wbsCode: '11111',
      };
      expect(await pipelineRequestsService.findOne(id)).toStrictEqual(result);
    });
  });

  describe('createRequest', () => {
    it('should return a created PipelineRequest', async () => {
      const request: CreatePipelineRequestDto = {
        projectType: 'software',
        projectName: 'My First Project',
        projectDescription: 'Coolest project ever!',
        projectLead: 'ABC124',
        projectTechLead: ['ABC144', 'GFD222'],
        orgUnit: 'Some business unit',
        wbsCode: '11111',
        language: 'Java',
        kanbanBoardRequired: true,
      };
      const result = {
        id: 'KEY',
        projectType: 'software',
        projectName: 'My First Project',
        projectDescription: 'Coolest project ever!',
        projectLead: 'ABC124',
        projectTechLead: ['ABC144', 'GFD222'],
        orgUnit: 'Some business unit',
        wbsCode: '11111',
        language: 'Java',
        kanbanBoardRequired: true,
      };
      expect(
        await pipelineRequestsService.createRequest(request),
      ).toStrictEqual(result);
    });
  });
});

class JiraServiceMock {
  async getPipelineRequestIssues(filterDto: GetPipelineRequestFilterDto) {
    return [
      {
        key: 'KEY',
        fields: {
          description:
            '{"projectType":"business","projectName":"My First Project","projectDescription":"Coolest project ever!","projectLead":"ABC124","projectTechLead":"ABC144,GFD222","orgUnit":"Some business unit","wbsCode":"11111"}',
        },
      },
    ];
  }
  async getPipelineRequestIssue(id: string) {
    return {
      key: 'KEY',
      fields: {
        description:
          '{"projectType":"business","projectName":"My First Project","projectDescription":"Coolest project ever!","projectLead":"ABC124","projectTechLead":"ABC144,GFD222","orgUnit":"Some business unit","wbsCode":"11111"}',
      },
    };
  }

  async createPipelineRequestIssue(id: string) {
    return {
      id: 'id',
      key: 'KEY',
      self: 'string',
    };
  }
}
