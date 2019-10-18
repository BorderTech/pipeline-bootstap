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

  @Column()
  key: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  type: string;

  @ManyToOne(type => Pipeline, pipeline => pipeline.artefacts)
  pipeline: Pipeline;
}
