import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CreatePipelineRequestDto } from './dtos/create-pipeline-request.dto';
import { GetPipelineRequestFilterDto } from './dtos/get-pipeline-requests-fitler.dto';
import { Logger } from 'winston';
import { InjectRepository } from '@nestjs/typeorm';
import { PipelineRequest } from './pipeline-request.entity';
import { Repository } from 'typeorm';
import { PipelineRequestStatus } from './pipeline-request-status.enum';
import { PipelineRequestSoftwareMetadata } from './pipeline-request-software.entity';
import { PipelineRequestBusinessMetadata } from './pipeline-request-business.entity';

@Injectable()
export class PipelineRequestsService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    @InjectRepository(PipelineRequest)
    private readonly pipelineRepository: Repository<PipelineRequest>,
  ) {}

  findAll(filterDto: GetPipelineRequestFilterDto): Promise<PipelineRequest[]> {
    if (filterDto.status) {
      return this.pipelineRepository.find({
        where: { status: filterDto.status },
        relations: ['businessMetadata', 'softwareMetadata'],
      });
    } else {
      return this.pipelineRepository.find({
        relations: ['businessMetadata', 'softwareMetadata'],
      });
    }
  }

  async createRequest(
    createRequestDto: CreatePipelineRequestDto,
  ): Promise<PipelineRequest> {
    try {
      this.logger.debug(
        `Creating pipeline request for project: ${
          createRequestDto.projectName
        }`,
        {
          label: 'PipelineRequestsService : createRequest',
          project: createRequestDto,
        },
      );
      // Construct the PiplineRequest object
      let pipelineRequest = new PipelineRequest();
      let softwareMetadata = new PipelineRequestSoftwareMetadata();
      let businessMetadata = new PipelineRequestBusinessMetadata();

      //Both Software & Business projects
      pipelineRequest.requestor = createRequestDto.requestor;
      pipelineRequest.projectName = createRequestDto.projectName;
      pipelineRequest.projectDescription = createRequestDto.projectDescription;
      pipelineRequest.projectType = createRequestDto.projectType;
      pipelineRequest.projectLead = createRequestDto.projectLead;
      pipelineRequest.wbsCode = createRequestDto.wbsCode;
      pipelineRequest.orgUnit = createRequestDto.orgUnit;
      // Set initial status to TODO
      pipelineRequest.status = PipelineRequestStatus.TODO;

      // Business only
      if (createRequestDto.projectType === 'business') {
        businessMetadata.projectManagementRequired =
          createRequestDto.businessMetadata.projectManagementRequired;

        pipelineRequest.businessMetadata = businessMetadata;
      }

      // Software only
      if (createRequestDto.projectType === 'software') {
        softwareMetadata.kanbanBoardRequired =
          createRequestDto.softwareMetadata.kanbanBoardRequired;
        softwareMetadata.projectTechLead =
          createRequestDto.softwareMetadata.projectTechLead;
        softwareMetadata.language = createRequestDto.softwareMetadata.language;

        pipelineRequest.softwareMetadata = softwareMetadata;
      }

      this.logger.debug(
        `Created pipeline request for project: ${createRequestDto.projectName}`,
        {
          label: 'PipelineRequestsService : createRequest',
          project: createRequestDto,
        },
      );

      // Save pipelineRequest to DB
      return await this.pipelineRepository.save(pipelineRequest);
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: number): Promise<PipelineRequest> {
    this.logger.debug(`Retrieving pipeline request with id: ${id}`, {
      label: 'PipelineRequestsService : findOne',
    });
    // Find PipelineRequest via ID
    const pipelineRequest: PipelineRequest = await this.pipelineRepository.findOne(
      {
        where: { id: id },
        relations: ['businessMetadata', 'softwareMetadata'],
      },
    );
    // Handle PipelineRequest not found
    if (!pipelineRequest) {
      this.logger.debug(`Pipeline request with id: ${id} was not found`, {
        label: 'PipelineRequestsService : findOne',
      });

      throw new NotFoundException(`PipelineRequest with ID "${id}" not found`);
    }

    this.logger.debug(`Retrieved pipeline request with id: ${id}`, {
      label: 'PipelineRequestsService : findOne',
      result: pipelineRequest,
    });
    // Return found PipelineRequest
    return pipelineRequest;
  }
}
