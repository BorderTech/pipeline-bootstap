import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Inject,
} from '@nestjs/common';
import { CreatePipelineDto } from './dtos/create-pipeline.dto';
import { PipelinesService } from './pipelines.service';
import { Logger } from 'winston';

@Controller('pipelines')
export class PipelinesController {
  constructor(
    private pipelinesService: PipelinesService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  createPipeline(@Body() createPipelineDto: CreatePipelineDto) {
    this.logger.debug(
      `User creating pipeline for project: ${createPipelineDto.projectName}`,
      {
        label: 'PipelinesController : createPipeline',
        project: createPipelineDto,
      },
    );
    return this.pipelinesService.createPipeline(createPipelineDto);
  }
}
