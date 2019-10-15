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
import { CreatePipelineResponseDto } from './dtos/create-pipeline-response.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('pipelines')
export class PipelinesController {
  constructor(
    private pipelinesService: PipelinesService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiResponse({
    status: 201,
    type: CreatePipelineResponseDto,
  })
  createPipeline(
    @Body() createPipelineDto: CreatePipelineDto,
  ): Promise<CreatePipelineResponseDto> {
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
