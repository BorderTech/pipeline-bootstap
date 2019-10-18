import { Module } from '@nestjs/common';
import { PipelineRequestsController } from './pipeline-requests.controller';
import { PipelineRequestsService } from './pipeline-requests.service';
import { JiraModule } from '../jira/jira.module';
import { ConfigModule } from '../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelineRequest } from './pipeline-request.entity';
import { PipelineRequestSoftwareMetadata } from './pipeline-request-software.entity';
import { PipelineRequestBusinessMetadata } from './pipeline-request-business.entity';

@Module({
  imports: [
    JiraModule,
    ConfigModule,
    TypeOrmModule.forFeature([PipelineRequest]),
    TypeOrmModule.forFeature([PipelineRequestSoftwareMetadata]),
    TypeOrmModule.forFeature([PipelineRequestBusinessMetadata]),
  ],
  controllers: [PipelineRequestsController],
  providers: [PipelineRequestsService],
  exports: [PipelineRequestsService],
})
export class PipelineRequestsModule {}
