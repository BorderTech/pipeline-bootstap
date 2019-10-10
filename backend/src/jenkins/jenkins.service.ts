import { Injectable, HttpService, HttpException } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Parser, Builder } from 'xml2js';
import { GetAuthCrumbsDto } from './dto/get-auth-crumbs.dto';
import * as cheerio from 'cheerio';

@Injectable()
export class JenkinsService {
  constructor(private readonly httpService: HttpService) {}

  async copyJob(
    newJobName: string,
    existingJobName: string,
    gitRepoUrl: string,
  ) {
    try {
      const authCrumbHeader = await this.makeAuthCrumbHeader();
      // Copy job from existing
      const copyJob = await this.httpService
        .post(
          `createItem?name=${newJobName}&mode=copy&from=${existingJobName}`,
          {},
          { headers: authCrumbHeader },
        )
        .pipe(map(response => response.data))
        .toPromise();
      // Update Git URL & return jobConfig as JSON
      return await this.updateJobGitUrl(newJobName, gitRepoUrl);
    } catch (error) {
      this.handleJenkinsResponseError(error);
    }
  }

  async deleteJob(jobName: string) {
    try {
      const authCrumbHeader = await this.makeAuthCrumbHeader();

      const deleteJob = await this.httpService
        .post(`job/${jobName}/doDelete`, {}, { headers: authCrumbHeader })
        .pipe(map(response => response.data))
        .toPromise();

      return;
    } catch (error) {
      this.handleJenkinsResponseError(error);
    }
  }

  private handleJenkinsResponseError(error) {
    if (error.response) {
      // Extract the error from the HTML returned by Jenkins
      // Error is returned as <h1>Error</h1><p>Error message here...</p>
      const $ = cheerio.load(error.response.data);
      const errorMessage = $('h1')
        .filter(function() {
          return (
            $(this)
              .text()
              .trim() === 'Error'
          );
        })
        .next()
        .text();
      // Throw error to the parent exception handler
      throw new HttpException(errorMessage, error.response.status);
    }
  }

  private async makeAuthCrumbHeader() {
    let authCrumbs: GetAuthCrumbsDto = await this.getAuthCrumbs();
    const { crumb, crumbRequestField } = authCrumbs;
    return {
      [crumbRequestField]: crumb,
    };
  }

  private async getAuthCrumbs(): Promise<GetAuthCrumbsDto> {
    return await this.httpService
      .get(`crumbIssuer/api/json`)
      .pipe(map(response => response.data))
      .toPromise();
  }

  private async updateJobGitUrl(jobName: string, gitRepoUrl: string) {
    const builder: Builder = new Builder();
    try {
      const authCrumbHeader = await this.makeAuthCrumbHeader();
      //Get config of job as JSON
      const jobConfigJson = await this.getJobConfigAsJson(jobName);
      //Update remote gitRepoUrl
      jobConfigJson[
        'org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject'
      ].sources[0].data[0][
        'jenkins.branch.BranchSource'
      ][0].source[0].remote[0] = `${gitRepoUrl}`;

      //   Post to Jenkins endpoint as XML
      const jobConfigXml = builder.buildObject(jobConfigJson);
      const updateJobConfig = await this.httpService
        .post(`job/${jobName}/config.xml`, jobConfigXml, {
          headers: { ...authCrumbHeader, 'Content-Type': 'application/xml' },
        })
        .pipe(map(response => response.data))
        .toPromise();

      // Return the updates config as JSON
      return await this.getJobConfigAsJson(jobName);
    } catch (error) {
      this.handleJenkinsResponseError(error);
    }
  }

  private async getJobConfigAsJson(jobName: string) {
    const parser: Parser = new Parser();
    try {
      const jobConfigXml = await this.httpService
        .get(`job/${jobName}/config.xml`)
        .pipe(map(response => response.data))
        .toPromise();
      //Parse to JSON from XML
      return await parser.parseStringPromise(jobConfigXml);
    } catch (error) {
      this.handleJenkinsResponseError(error);
    }
  }
}
