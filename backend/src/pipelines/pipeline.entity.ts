import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { PipelineRequest } from '../pipeline-requests/pipeline-request.entity';
import { PipelineArtefact } from './pipeline-artefact.entity';

@Entity()
export class Pipeline {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column()
  name: string;

  @ApiModelProperty()
  @OneToMany(
    type => PipelineArtefact,
    pipelineArtefact => pipelineArtefact.pipeline,
    {
      cascade: true,
    },
  )
  artefacts: PipelineArtefact[];

  //   @OneToOne(type => PipelineRequest)
  //   @JoinColumn()
  //   piplineRequest: PipelineRequest;
}
