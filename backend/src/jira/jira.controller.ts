import { Controller, Get } from '@nestjs/common';
import { JiraService } from './jira.service';

@Controller('jira')
export class JiraController {
  constructor(private jiraService: JiraService) {}

  @Get()
  getMyPermissions() {
    return this.jiraService.getMyPermissions();
  }
}
