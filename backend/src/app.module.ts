import { Module } from '@nestjs/common';
import { RequestsModule as PipelineRequestsModule } from './pipeline-requests/pipeline-requests.module';

@Module({
  imports: [PipelineRequestsModule],
})
export class AppModule {}
