import { Test, TestingModule } from '@nestjs/testing';
import { PipelineRequestsController } from './pipeline-requests.controller';

describe('PipelineRequests Controller', () => {
  let controller: PipelineRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PipelineRequestsController],
    }).compile();

    controller = module.get<PipelineRequestsController>(
      PipelineRequestsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
