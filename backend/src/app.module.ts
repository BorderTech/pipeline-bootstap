import { Module, HttpModule } from '@nestjs/common';
import { PipelineRequestsModule } from './pipeline-requests/pipeline-requests.module';
import { JiraModule } from './jira/jira.module';
import { ConfigModule } from './config/config.module';
import { JiraService } from './jira/jira.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelinesModule } from './pipelines/pipelines.module';
import { ConfluenceModule } from './confluence/confluence.module';
import { BitbucketModule } from './bitbucket/bitbucket.module';
import { WinstonModule } from 'nest-winston';
import { JenkinsModule } from './jenkins/jenkins.module';
import * as winston from 'winston';

const logFormat = winston.format.printf(
  info =>
    `${info.timestamp} ${info.level} [${
      info.label ? info.label : 'PipelineBootstrap'
    }]: ${info.message}`,
);
@Module({
  imports: [
    PipelineRequestsModule,
    JiraModule,
    ConfigModule,
    PipelinesModule,
    ConfluenceModule,
    BitbucketModule,
    TypeOrmModule.forRoot({
      type: 'sqljs',
      // database: 'db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    WinstonModule.forRoot({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        // Allows for log label to be overridden
        // winston.format.label({
        //   label: 'PipelineBootstrap',
        // }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.metadata({
          fillExcept: ['message', 'level', 'timestamp', 'label'],
        }),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), logFormat),
        }),
        new winston.transports.File({
          filename: 'combined.log',
          format: winston.format.combine(winston.format.json()),
        }),
      ],
      exitOnError: false,
    }),
    JenkinsModule,
  ],
})
export class AppModule {}
