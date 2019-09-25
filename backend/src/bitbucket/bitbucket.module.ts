import { Module, HttpModule } from '@nestjs/common';
import { BitbucketService } from './bitbucket.service';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';

const configService = new ConfigService(`${process.env.NODE_ENV}.env`);

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      baseURL: configService.bitbucketBaseURL,
      auth: {
        username: configService.bitbucketUsername,
        password: configService.bitbucketPassword,
      },
    }),
  ],
  providers: [BitbucketService],
  exports: [BitbucketService],
})
export class BitbucketModule {}
