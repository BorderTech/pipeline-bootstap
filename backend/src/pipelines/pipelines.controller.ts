import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Query,
} from '@nestjs/common';
import { CreatePipelineDto } from './dtos/create-pipeline.dto';
import { PipelinesService } from './pipelines.service';

@Controller('pipelines')
export class PipelinesController {
  constructor(private pipelinesService: PipelinesService) {}
  @Post()
  @UsePipes(ValidationPipe)
  createPipeline(@Body() createPipelineDto: CreatePipelineDto) {
    return this.pipelinesService.createPipeline(createPipelineDto);
  }
}
