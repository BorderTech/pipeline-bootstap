import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as fs from 'fs';

export interface EnvConfig {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  get nodeEnv(): string {
    return this.envConfig.NODE_ENV;
  }

  get jiraUsername(): string {
    return this.envConfig.JIRA_USERNAME;
  }

  get jiraPassword(): string {
    return this.envConfig.JIRA_PASSWORD;
  }

  get jiraBaseURL(): string {
    return this.envConfig.JIRA_BASE_URL;
  }

  get jiraWebBaseURL(): string {
    return this.envConfig.JIRA_WEB_BASE_URL;
  }

  get confluenceUsername(): string {
    return this.envConfig.CONFLUENCE_USERNAME;
  }

  get confluencePassword(): string {
    return this.envConfig.CONFLUENCE_PASSWORD;
  }

  get confluenceBaseURL(): string {
    return this.envConfig.CONFLUENCE_BASE_URL;
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test', 'provision'])
        .default('development'),
      JIRA_BASE_URL: Joi.string().required(),
      JIRA_WEB_BASE_URL: Joi.string().required(),
      JIRA_USERNAME: Joi.string().required(),
      JIRA_PASSWORD: Joi.string().required(),
      CONFLUENCE_BASE_URL: Joi.string().required(),
      CONFLUENCE_USERNAME: Joi.string().required(),
      CONFLUENCE_PASSWORD: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}
