import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { PipelineRequestSoftwareMetadata } from './pipeline-request-software.entity';
import { PipelineRequestBusinessMetadata } from './pipeline-request-business.entity';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class PipelineRequest {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column()
  requestor: string;

  @ApiModelProperty()
  @Column()
  projectType: string;

  @ApiModelProperty()
  @Column()
  projectName: string;

  @ApiModelProperty()
  @Column()
  projectDescription: string;

  @ApiModelProperty()
  @Column()
  wbsCode: string;

  @ApiModelProperty()
  @Column()
  orgUnit: string;

  @ApiModelProperty()
  @Column()
  status: string;

  @ApiModelProperty()
  @Column()
  projectLead: string;

  @ApiModelProperty()
  @Column()
  jiraIssueUrl: string;

  @ApiModelProperty()
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @ApiModelProperty()
  @OneToOne(
    type => PipelineRequestSoftwareMetadata,
    softwareMetadata => softwareMetadata.pipelineRequest,
    {
      cascade: true,
    },
  )
  softwareMetadata: PipelineRequestSoftwareMetadata;

  @ApiModelProperty()
  @OneToOne(
    type => PipelineRequestBusinessMetadata,
    businessMetadata => businessMetadata.pipelineRequest,
    {
      cascade: true,
    },
  )
  businessMetadata: PipelineRequestBusinessMetadata;
}
