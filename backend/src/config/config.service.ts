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

  /*********** JIRA *************/

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

  get jiraIssueDoneLabel(): string {
    return this.envConfig.JIRA_ISSUE_DONE_LABEL;
  }

  get jiraIssueRepositoryKey(): string {
    return this.envConfig.JIRA_ISSUE_REPOSITORY_KEY;
  }

  get jiraPipelineRequestIssueType(): string {
    return this.envConfig.JIRA_PIPELINE_REQUEST_ISSUE_TYPE;
  }

  get jiraPipelineRequestSummaryText(): string {
    return this.envConfig.JIRA_PIPELINE_REQUEST_SUMMARY_TEXT;
  }

  /*********** CONFLUENCE *************/

  get confluenceUsername(): string {
    return this.envConfig.CONFLUENCE_USERNAME;
  }

  get confluencePassword(): string {
    return this.envConfig.CONFLUENCE_PASSWORD;
  }

  get confluenceBaseURL(): string {
    return this.envConfig.CONFLUENCE_BASE_URL;
  }

  /*********** BITBUCKET *************/

  get bitbucketUsername(): string {
    return this.envConfig.BITBUCKET_USERNAME;
  }

  get bitbucketPassword(): string {
    return this.envConfig.BITBUCKET_PASSWORD;
  }

  get bitbucketBaseURL(): string {
    return this.envConfig.BITBUCKET_BASE_URL;
  }

  get bitbucketWebBaseURL(): string {
    return this.envConfig.BITBUCKET_WEB_BASE_URL;
  }

  get bitbucketProject(): string {
    return this.envConfig.BITBUCKET_PROJECT;
  }

  /*********** JENKINS *************/

  get jenkinsUsername(): string {
    return this.envConfig.JENKINS_USERNAME;
  }

  get jenkinsPassword(): string {
    return this.envConfig.JENKINS_PASSWORD;
  }

  get jenkinsBaseURL(): string {
    return this.envConfig.JENKINS_BASE_URL;
  }

  get jenkinsCopyFromJobName(): string {
    return this.envConfig.JENKINS_COPY_FROM_JOB_NAME;
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
      JIRA_ISSUE_DONE_LABEL: Joi.string().required(),

      JIRA_ISSUE_REPOSITORY_KEY: Joi.string().required(),
      JIRA_PIPELINE_REQUEST_ISSUE_TYPE: Joi.string().required(),
      JIRA_PIPELINE_REQUEST_SUMMARY_TEXT: Joi.string().required(),

      CONFLUENCE_BASE_URL: Joi.string().required(),
      CONFLUENCE_USERNAME: Joi.string().required(),
      CONFLUENCE_PASSWORD: Joi.string().required(),

      BITBUCKET_BASE_URL: Joi.string().required(),
      BITBUCKET_WEB_BASE_URL: Joi.string().required(),
      BITBUCKET_PROJECT: Joi.string().required(),
      BITBUCKET_USERNAME: Joi.string().required(),
      BITBUCKET_PASSWORD: Joi.string().required(),

      JENKINS_BASE_URL: Joi.string().required(),
      JENKINS_USERNAME: Joi.string().required(),
      JENKINS_PASSWORD: Joi.string().required(),
      JENKINS_COPY_FROM_JOB_NAME: Joi.string().required(),
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
