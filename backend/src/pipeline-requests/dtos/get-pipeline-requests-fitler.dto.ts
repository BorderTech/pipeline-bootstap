import { PipelineRequestStatus } from '../pipeline-request-status.emum';
import { IsOptional, IsIn } from 'class-validator';

export class GetPipelineRequestFilterDto {
  @IsOptional()
  @IsIn([PipelineRequestStatus.TODO, PipelineRequestStatus.DONE])
  status: PipelineRequestStatus;
}
