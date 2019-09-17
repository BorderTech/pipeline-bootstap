import { Module, HttpModule } from '@nestjs/common';
import { ConfluenceService } from './confluence.service';
import { ConfigService } from '../config/config.service';

const configService = new ConfigService(`${process.env.NODE_ENV}.env`);
@Module({
  imports: [
    HttpModule.register({
      baseURL: configService.confluenceBaseURL,
      auth: {
        username: configService.confluenceUsername,
        password: configService.confluencePassword,
      },
    }),
  ],
  providers: [ConfluenceService],
  exports: [ConfluenceService],
})
export class ConfluenceModule {}
