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
  getRequests(@Query() filterDto: GetPipelineRequestFilterDto) {
    console.log(filterDto);
    return this.requestsService.getAllRequests(filterDto);
  }
  @Get(':id')
  getRequest(@Param('id') id: string) {
    return this.requestsService.getRequestById(id);
  }
  @Post()
  @UsePipes(ValidationPipe)
  createRequest(@Body() createRequestDto: CreatePipelineRequestDto) {
    return this.requestsService.createRequest(createRequestDto);
  }
}
