import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, IsOptional, IsNumber } from 'class-validator';

class SoftwareMetadata {
  @ApiModelProperty()
  @IsArray()
  projectTechLead: string[];

  @ApiModelProperty()
  language: string;

  @ApiModelProperty()
  kanbanBoardRequired: boolean;
}

class BusinessMetadata {
  @ApiModelProperty()
  projectManagementRequired: boolean;
}

export class CreatePipelineDto {
  @ApiModelProperty()
  @IsNotEmpty()
  @IsNumber()
  requestId: number;

  @ApiModelProperty()
  @IsNotEmpty()
  projectType: string;

  @ApiModelProperty()
  @IsNotEmpty()
  requestor: string;

  @ApiModelProperty()
  @IsNotEmpty()
  projectName: string;

  @ApiModelProperty()
  @IsNotEmpty()
  projectDescription: string;

  @ApiModelProperty()
  @IsNotEmpty()
  orgUnit: string;

  @ApiModelProperty()
  @IsNotEmpty()
  projectLead: string;

  @ApiModelProperty()
  @IsNotEmpty()
  wbsCode: string;

  @ApiModelProperty()
  @IsOptional()
  businessMetadata: BusinessMetadata;

  @ApiModelProperty()
  @IsOptional()
  softwareMetadata: SoftwareMetadata;
}
