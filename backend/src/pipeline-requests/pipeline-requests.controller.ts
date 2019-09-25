import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Query,
  Logger,
} from '@nestjs/common';
import { CreatePipelineRequestDto } from './dtos/create-pipeline-request.dto';
import { PipelineRequest } from './pipeline-request.model';
import { PipelineRequestsService } from './pipeline-requests.service';
import { GetPipelineRequestFilterDto } from './dtos/get-pipeline-requests-fitler.dto';

@Controller('pipeline-requests')
export class PipelineRequestsController {
  private logger = new Logger('PipelineRequestsController');

  constructor(private pipelineRequestsService: PipelineRequestsService) {}

  @Get()
  findAll(
    @Query() filterDto: GetPipelineRequestFilterDto,
  ): Promise<PipelineRequest[]> {
    this.logger.verbose(
      `User retrieving all pipeline requests. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.pipelineRequestsService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PipelineRequest> {
    this.logger.verbose(`User retrieving pipeline request. Id: ${id}`);
    return this.pipelineRequestsService.findOne(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createRequest(
    @Body() createRequestDto: CreatePipelineRequestDto,
  ): Promise<PipelineRequest> {
    this.logger.verbose(
      `User creating pipeline request. Data: ${JSON.stringify(
        createRequestDto,
      )}`,
    );
    return this.pipelineRequestsService.createRequest(createRequestDto);
  }
}
