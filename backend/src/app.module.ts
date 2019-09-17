import { Module, HttpModule } from '@nestjs/common';
import { PipelineRequestsModule } from './pipeline-requests/pipeline-requests.module';
import { JiraModule } from './jira/jira.module';
import { ConfigModule } from './config/config.module';
import { JiraService } from './jira/jira.service';
import { PipelinesModule } from './pipelines/pipelines.module';
import { ConfluenceModule } from './confluence/confluence.module';

@Module({
  imports: [PipelineRequestsModule, JiraModule, ConfigModule, PipelinesModule, ConfluenceModule],
})
export class AppModule {}
