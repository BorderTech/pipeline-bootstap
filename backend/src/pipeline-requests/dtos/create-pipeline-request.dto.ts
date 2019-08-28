import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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
  projectLead: string;

  @ApiModelProperty()
  projectTechLead: string[];

  @ApiModelProperty()
  language: string;

  @ApiModelProperty()
  kanbanBoardRequired: boolean;

  @ApiModelProperty()
  @IsNotEmpty()
  wbsCode: string;
}
