import { Module } from '@nestjs/common';
import { PipelinesController } from './pipelines.controller';
import { PipelinesService } from './pipelines.service';
import { JiraModule } from '../jira/jira.module';
import { ConfluenceModule } from '../confluence/confluence.module';
import { BitbucketModule } from '../bitbucket/bitbucket.module';
import { ConfigModule } from '../config/config.module';
import { JenkinsModule } from '../jenkins/jenkins.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelineArtefact } from './pipeline-artefact.entity';
import { Pipeline } from './pipeline.entity';
import { PipelineRequest } from '../pipeline-requests/pipeline-request.entity';
import { PipelineRequestsModule } from '../pipeline-requests/pipeline-requests.module';

@Module({
  imports: [
    JiraModule,
    ConfluenceModule,
    BitbucketModule,
    JenkinsModule,
    ConfigModule,
    PipelineRequestsModule,
    TypeOrmModule.forFeature([Pipeline]),
    TypeOrmModule.forFeature([PipelineArtefact]),
  ],
  controllers: [PipelinesController],
  providers: [PipelinesService],
})
export class PipelinesModule {}
