import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class CreatePipelineDto {
  @ApiModelProperty()
  @IsNotEmpty() // example of custom message
  @IsString()
  projectType: string;

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  projectName: string;

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  projectDescription: string;

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  orgUnit: string;

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  projectLead: string;

  @ApiModelProperty()
  @IsArray()
  projectTechLead: string[];

  @ApiModelProperty()
  @IsOptional()
  @IsString()
  language: string;

  @ApiModelProperty()
  @IsOptional()
  @IsBoolean()
  kanbanBoardRequired: boolean;

  @ApiModelProperty()
  @IsOptional()
  @IsBoolean()
  projectManagementRequired: boolean;

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  wbsCode: string;
}
