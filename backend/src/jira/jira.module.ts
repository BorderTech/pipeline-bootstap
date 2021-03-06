import { Module, HttpModule } from '@nestjs/common';
import { JiraService } from './jira.service';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';

const configService = new ConfigService(`${process.env.NODE_ENV}.env`);
@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      baseURL: configService.jiraBaseURL,
      auth: {
        username: configService.jiraUsername,
        password: configService.jiraPassword,
      },
    }),
  ],
  providers: [JiraService],
  exports: [JiraService],
})
export class JiraModule {}
