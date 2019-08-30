import { Module, HttpModule } from '@nestjs/common';
import { PipelineRequestsModule } from './pipeline-requests/pipeline-requests.module';
import { JiraModule } from './jira/jira.module';
import { ConfigModule } from './config/config.module';
import { JiraService } from './jira/jira.service';

@Module({
  imports: [PipelineRequestsModule, JiraModule, ConfigModule],
})
export class AppModule {}
