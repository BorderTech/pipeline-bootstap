import { Test, TestingModule } from '@nestjs/testing';
import { PipelinesController } from './pipelines.controller';
import { PipelinesService } from './pipelines.service';

describe('Pipelines Controller', () => {
  let controller: PipelinesController;
  let service: PipelinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PipelinesController],
      providers: [
        {
          provide: PipelinesService,
          useValue: {
            createPipeline: jest.fn(),
          },
        },
        {
          provide: 'winston',
          useFactory: () => require('winston'),
        },
      ],
    }).compile();

    service = module.get<PipelinesService>(PipelinesService);
    controller = module.get<PipelinesController>(PipelinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPipeline', () => {
    it('should return a created pipeline', async () => {
      // const result = Promise.resolve([pipelineRequest]);
      // jest.spyOn(service, 'findAll').mockImplementation(() => result);
      // let filterDto = new GetPipelineRequestFilterDto();
      // expect(await controller.findAll(filterDto)).toStrictEqual([
      //   pipelineRequest,
      // ]);
    });
  });
});
