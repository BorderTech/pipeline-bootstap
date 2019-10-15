import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Query,
  Inject,
} from '@nestjs/common';
import { CreatePipelineRequestDto } from './dtos/create-pipeline-request.dto';
// import { PipelineRequest } from './pipeline-request.model';
import { PipelineRequestsService } from './pipeline-requests.service';
import { GetPipelineRequestFilterDto } from './dtos/get-pipeline-requests-fitler.dto';
import { Logger } from 'winston';
import { PipelineRequest } from './pipeline-request.entity';
import { ApiResponse } from '@nestjs/swagger';

@Controller('pipeline-requests')
export class PipelineRequestsController {
  constructor(
    @Inject('PipelineRequestsService')
    private readonly pipelineRequestsService: PipelineRequestsService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'All PipelineRequests matching filter',
    type: PipelineRequest,
  })
  findAll(
    @Query() filterDto: GetPipelineRequestFilterDto,
  ): Promise<PipelineRequest[]> {
    this.logger.debug(
      `User retrieving all pipeline requests with status: ${
        filterDto.status
      }. `,
      { label: 'PipelineRequestsController : findAll', filter: filterDto },
    );

    return this.pipelineRequestsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found PipelineRequest record',
    type: PipelineRequest,
  })
  findOne(@Param('id') id: string): Promise<PipelineRequest> {
    this.logger.debug(`User retrieving pipeline request with id: ${id}`, {
      label: 'PipelineRequestsController : findOne',
      id: id,
    });

    return this.pipelineRequestsService.findOne(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiResponse({
    status: 201,
    description: 'The created PipelineRequest record',
    type: PipelineRequest,
  })
  createRequest(
    @Body() createRequestDto: CreatePipelineRequestDto,
  ): Promise<PipelineRequest> {
    this.logger.debug(
      `User creating pipeline request for project: ${
        createRequestDto.projectName
      }.`,
      {
        label: 'PipelineRequestsController : findOne',
        project: createRequestDto,
      },
    );

    return this.pipelineRequestsService.createRequest(createRequestDto);
  }
}
