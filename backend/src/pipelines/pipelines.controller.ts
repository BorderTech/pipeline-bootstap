import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Inject,
  Get,
  Param,
} from '@nestjs/common';
import { CreatePipelineDto } from './dtos/create-pipeline.dto';
import { PipelinesService } from './pipelines.service';
import { Logger } from 'winston';
import { CreatePipelineResponseDto } from './dtos/create-pipeline-response.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Pipeline } from './pipeline.entity';

@Controller('pipelines')
export class PipelinesController {
  constructor(
    private pipelinesService: PipelinesService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  @Get()
  @UsePipes(ValidationPipe)
  findAll(): Promise<Pipeline[]> {
    return this.pipelinesService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found Pipeline record',
    type: Pipeline,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  findOne(@Param('id') id: number): Promise<Pipeline> {
    this.logger.debug(`User retrieving pipeline with id: ${id}`, {
      label: 'PipelinesController : findOne',
      id: id,
    });
    return this.pipelinesService.findOne(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiResponse({
    status: 201,
    type: Pipeline,
  })
  createPipeline(
    @Body() createPipelineDto: CreatePipelineDto,
  ): Promise<Pipeline> {
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
