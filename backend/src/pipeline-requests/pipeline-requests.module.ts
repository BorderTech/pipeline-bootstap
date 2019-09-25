import { Module } from '@nestjs/common';
import { PipelineRequestsController } from './pipeline-requests.controller';
import { PipelineRequestsService } from './pipeline-requests.service';
import { JiraModule } from '../jira/jira.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [JiraModule, ConfigModule],
  controllers: [PipelineRequestsController],
  providers: [PipelineRequestsService],
})
export class PipelineRequestsModule {}
