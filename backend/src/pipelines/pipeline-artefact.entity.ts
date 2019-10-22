import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Pipeline } from './pipeline.entity';

@Entity()
export class PipelineArtefact {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column()
  key: string;

  @ApiModelProperty()
  @Column()
  name: string;

  @ApiModelProperty()
  @Column()
  url: string;

  @ApiModelProperty()
  @Column()
  type: string;

  @ApiModelProperty()
  @ManyToOne(type => Pipeline, pipeline => pipeline.artefacts)
  pipeline: Pipeline;
}
