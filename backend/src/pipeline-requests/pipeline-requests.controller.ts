import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { CreatePipelineRequestDto } from './dtos/create-pipeline-request.dto';
import { PipelineRequest } from './pipeline-request.model';
import { PipelineRequestsService } from './pipeline-requests.service';

@Controller('pipeline-requests')
export class PipelineRequestsController {
  constructor(private requestsService: PipelineRequestsService) {}
  @Get()
  getRequests(): PipelineRequest[] {
    return this.requestsService.getAllRequests();
  }
  @Get(':id')
  getRequest(@Param('id') id: string): PipelineRequest {
    return this.requestsService.getRequestById(id);
  }
  @Post()
  @UsePipes(ValidationPipe)
  createRequest(@Body() createRequestDto: CreatePipelineRequestDto) {
    return this.requestsService.createRequest(createRequestDto);
  }
}
