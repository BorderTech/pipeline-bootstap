import { Module, HttpModule } from '@nestjs/common';
import { JiraService } from './jira.service';
import { JiraController } from './jira.controller';
import { ConfigService } from '../config/config.service';

const configService = new ConfigService(`${process.env.NODE_ENV}.env`);
@Module({
  imports: [
    HttpModule.register({
      baseURL: configService.jiraBaseURL,
      auth: {
        username: configService.jiraUsername,
        password: configService.jiraPassword,
      },
    }),
  ],
  providers: [JiraService],
  controllers: [JiraController],
})
export class JiraModule {}
