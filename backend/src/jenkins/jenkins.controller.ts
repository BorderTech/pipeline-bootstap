import { Controller, Post, Body } from '@nestjs/common';
import { JenkinsService } from './jenkins.service';
import { CreatePipelineDto } from '../pipelines/dtos/create-pipeline.dto';

@Controller('jenkins')
export class JenkinsController {
  constructor(private jenkinsService: JenkinsService) {}

  @Post()
  createJob(@Body() createPipelineDto: CreatePipelineDto) {
    // return this.jenkinsService.createJob(createPipelineDto);
    return this.jenkinsService.copyJob(
      'PipeReqTestCopy1',
      'MyRepo101',
      'aGitURL',
    );
  }
}
