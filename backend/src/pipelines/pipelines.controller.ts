import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Logger,
} from '@nestjs/common';
import { CreatePipelineDto } from './dtos/create-pipeline.dto';
import { PipelinesService } from './pipelines.service';

@Controller('pipelines')
export class PipelinesController {
  private logger = new Logger('PipelinesController');

  constructor(private pipelinesService: PipelinesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createPipeline(@Body() createPipelineDto: CreatePipelineDto) {
    this.logger.verbose(
      `User creating pipeline. Data: ${JSON.stringify(createPipelineDto)}`,
    );
    return this.pipelinesService.createPipeline(createPipelineDto);
  }
}
