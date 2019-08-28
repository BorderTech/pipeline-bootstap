import { Module } from '@nestjs/common';
import { PipelineRequestsController } from './pipeline-requests.controller';
import { PipelineRequestsService } from './pipeline-requests.service';

@Module({
  controllers: [PipelineRequestsController],
  providers: [PipelineRequestsService],
})
export class RequestsModule {}
