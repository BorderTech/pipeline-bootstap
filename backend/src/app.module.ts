import { Module, HttpModule } from '@nestjs/common';
import { RequestsModule as PipelineRequestsModule } from './pipeline-requests/pipeline-requests.module';
import { JiraModule } from './jira/jira.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [PipelineRequestsModule, JiraModule, ConfigModule],
})
export class AppModule {}
