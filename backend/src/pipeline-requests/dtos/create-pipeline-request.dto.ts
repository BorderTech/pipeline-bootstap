import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreatePipelineRequestDto {
  @ApiModelProperty()
  @IsNotEmpty({ message: 'Project Type should not be empty.' }) // example of custom message
  projectType: string;

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
  @IsArray()
  projectTechLead: string[];

  @ApiModelProperty()
  @IsOptional()
  language: string;

  @ApiModelProperty()
  @IsOptional()
  kanbanBoardRequired?: boolean;

  @ApiModelProperty()
  @IsOptional()
  projectManagementRequired?: boolean;

  @ApiModelProperty()
  @IsNotEmpty()
  wbsCode: string;
}
