import { Injectable, NotFoundException } from '@nestjs/common';
import { PipelineRequest } from './pipeline-request.model';
import * as uuid from 'uuid/v1';
import { CreatePipelineRequestDto } from './dtos/create-pipeline-request.dto';

@Injectable()
export class PipelineRequestsService {
  private requests: PipelineRequest[] = [];

  getAllRequests(): PipelineRequest[] {
    return this.requests;
  }

  getRequestById(id: string): PipelineRequest {
    const found = this.requests.find(request => request.id === id);
    if (!found) {
      throw new NotFoundException(`Request with id: ${id} not found`);
    }
    return this.requests.find(request => request.id === id);
  }

  createRequest(createRequestDto: CreatePipelineRequestDto): PipelineRequest {
    const {
      projectType,
      projectName,
      projectDescription,
      projectLead,
      projectTechLead,
      language,
      kanbanBoardRequired,
      wbsCode,
    } = createRequestDto;

    const request: PipelineRequest = {
      id: uuid(),
      projectType,
      projectName,
      projectDescription,
      projectLead,
      projectTechLead,
      language,
      kanbanBoardRequired,
      wbsCode,
    };

    this.requests.push(request);
    return request;
  }
}
