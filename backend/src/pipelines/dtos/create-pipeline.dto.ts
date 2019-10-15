import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

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
  @IsNotEmpty({ message: 'Project Type should not be empty.' }) // example of custom message
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
