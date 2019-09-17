import { Module } from '@nestjs/common';
import { PipelinesController } from './pipelines.controller';
import { PipelinesService } from './pipelines.service';
import { JiraModule } from '../jira/jira.module';
import { ConfluenceModule } from '../confluence/confluence.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [JiraModule, ConfluenceModule, ConfigModule],
  controllers: [PipelinesController],
  providers: [PipelinesService],
})
export class PipelinesModule {}
