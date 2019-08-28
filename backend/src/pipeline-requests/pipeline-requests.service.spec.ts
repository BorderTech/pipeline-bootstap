import { Test, TestingModule } from '@nestjs/testing';
import { PipelineRequestsService } from './pipeline-requests.service';

describe('PipelineRequestsService', () => {
  let service: PipelineRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PipelineRequestsService],
    }).compile();

    service = module.get<PipelineRequestsService>(PipelineRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
