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
export class PipelineRequestSoftwareMetadata {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ default: false })
  kanbanBoardRequired: boolean;

  @ApiModelProperty()
  @Column({
    type: 'simple-array',
    nullable: true,
  })
  projectTechLead: string[];

  @ApiModelProperty()
  @Column({
    nullable: true,
  })
  language: string;

  @ApiModelProperty()
  @OneToOne(
    type => PipelineRequest,
    pipelineRequest => pipelineRequest.softwareMetadata,
  )
  @ApiModelProperty()
  @JoinColumn()
  pipelineRequest: PipelineRequest;
}
