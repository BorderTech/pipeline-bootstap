import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { PipelineRequest } from './pipeline-request.entity';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class PipelineRequestBusinessMetadata {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ default: false })
  projectManagementRequired: boolean;

  @ApiModelProperty()
  @OneToOne(
    type => PipelineRequest,
    pipelineRequest => pipelineRequest.businessMetadata,
  )
  @ApiModelProperty()
  @JoinColumn()
  pipelineRequest: PipelineRequest;
}
