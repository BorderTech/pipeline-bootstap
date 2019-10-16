import { Module, HttpModule } from '@nestjs/common';
import { JenkinsService } from './jenkins.service';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';

const configService = new ConfigService(`${process.env.NODE_ENV}.env`);
@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      baseURL: configService.jenkinsBaseURL,
      auth: {
        username: configService.jenkinsUsername,
        password: configService.jenkinsPassword,
      },
    }),
  ],
  providers: [JenkinsService],
  exports: [JenkinsService],
})
export class JenkinsModule {}
