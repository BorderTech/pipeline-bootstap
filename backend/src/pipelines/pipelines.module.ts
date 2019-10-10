import { Module } from '@nestjs/common';
import { PipelinesController } from './pipelines.controller';
import { PipelinesService } from './pipelines.service';
import { JiraModule } from '../jira/jira.module';
import { ConfluenceModule } from '../confluence/confluence.module';
import { BitbucketModule } from '../bitbucket/bitbucket.module';
import { ConfigModule } from '../config/config.module';
import { JenkinsModule } from '../jenkins/jenkins.module';

@Module({
  imports: [
    JiraModule,
    ConfluenceModule,
    BitbucketModule,
    JenkinsModule,
    ConfigModule,
  ],
  controllers: [PipelinesController],
  providers: [PipelinesService],
})
export class PipelinesModule {}
