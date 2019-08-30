import { Module } from '@nestjs/common';
import { PipelineRequestsController } from './pipeline-requests.controller';
import { PipelineRequestsService } from './pipeline-requests.service';
import { JiraModule } from '../jira/jira.module';

@Module({
  imports: [JiraModule],
  controllers: [PipelineRequestsController],
  providers: [PipelineRequestsService],
})
export class PipelineRequestsModule {}
