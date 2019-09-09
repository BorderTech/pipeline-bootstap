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
import { CreatePipelineRequestDto } from './dtos/create-pipeline-request.dto';
import { PipelineRequest } from './pipeline-request.model';
import { PipelineRequestsService } from './pipeline-requests.service';
import { GetPipelineRequestFilterDto } from './dtos/get-pipeline-requests-fitler.dto';

@Controller('pipeline-requests')
export class PipelineRequestsController {
  constructor(private requestsService: PipelineRequestsService) {}
  @Get()
  findAll(
    @Query() filterDto: GetPipelineRequestFilterDto,
  ): Promise<PipelineRequest[]> {
    return this.requestsService.findAll(filterDto);
  }
  @Get(':id')
  findOne(@Param('id') id: string): Promise<PipelineRequest> {
    return this.requestsService.findOne(id);
  }
  @Post()
  @UsePipes(ValidationPipe)
  createRequest(
    @Body() createRequestDto: CreatePipelineRequestDto,
  ): Promise<PipelineRequest> {
    return this.requestsService.createRequest(createRequestDto);
  }
}
