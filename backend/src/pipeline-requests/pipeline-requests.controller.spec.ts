import { Test, TestingModule } from '@nestjs/testing';
import { PipelineRequestsController } from './pipeline-requests.controller';
import { PipelineRequestsService } from './pipeline-requests.service';
import { PipelineRequest } from './pipeline-request.model';
import { GetPipelineRequestFilterDto } from './dtos/get-pipeline-requests-fitler.dto';
import { CreatePipelineRequestDto } from './dtos/create-pipeline-request.dto';

describe('PipelineRequestsController', () => {
  let controller: PipelineRequestsController;
  let service: PipelineRequestsService;

  const pipelineRequest: PipelineRequest = {
    id: 'PIPEREQ-1',
    projectType: 'software',
    projectName: 'Test Project',
    projectDescription: 'string',
    projectLead: 'ABC123',
    projectTechLead: ['ABC123'],
    language: 'Java',
    kanbanBoardRequired: true,
    created: new Date('2019-09-06'),
    status: 'To Do',
    wbsCode: '123456',
    orgUnit: 'string',
  };

  const createPipelineRequest: CreatePipelineRequestDto = {
    projectType: 'software',
    projectName: 'Test Project',
    projectDescription: 'string',
    projectLead: 'ABC123',
    projectTechLead: ['ABC123'],
    language: 'Java',
    kanbanBoardRequired: true,
    wbsCode: '123456',
    orgUnit: 'string',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PipelineRequestsController],
      providers: [
        {
          provide: PipelineRequestsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            createRequest: jest.fn(),
          },
        },
        {
          provide: 'winston',
          useFactory: () => require('winston'),
        },
      ],
    }).compile();

    controller = module.get<PipelineRequestsController>(
      PipelineRequestsController,
    );
    service = module.get<PipelineRequestsService>(PipelineRequestsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of PipelineRequest', async () => {
      const result = Promise.resolve([pipelineRequest]);
      jest.spyOn(service, 'findAll').mockImplementation(() => result);
      let filterDto = new GetPipelineRequestFilterDto();
      expect(await controller.findAll(filterDto)).toStrictEqual([
        pipelineRequest,
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a PipelineRequest', async () => {
      const result = Promise.resolve(pipelineRequest);
      jest.spyOn(service, 'findOne').mockImplementation(() => result);
      expect(await controller.findOne('string')).toStrictEqual(pipelineRequest);
    });
  });

  describe('createRequest', () => {
    it('should return a created PipelineRequest', async () => {
      const result = Promise.resolve(pipelineRequest);
      jest.spyOn(service, 'createRequest').mockImplementation(() => result);
      expect(
        await controller.createRequest(createPipelineRequest),
      ).toStrictEqual(pipelineRequest);
    });
  });
});
