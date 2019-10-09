import { Injectable, HttpService } from '@nestjs/common';
import { CreatePipelineDto } from '../pipelines/dtos/create-pipeline.dto';
import { map } from 'rxjs/operators';
import { Parser, Builder } from 'xml2js';
import { handleAxiosError } from '../common/errors/axios-error-handler';
import { GetAuthCrumbsDto } from './dto/get-auth-crumbs.dto';

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
      return await this.updateJobGitUrl(
        newJobName,
        gitRepoUrl,
        authCrumbHeader,
      );
    } catch (error) {
      handleAxiosError(error);
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

  private async updateJobGitUrl(
    jobName: string,
    gitRepoUrl: string,
    authCrumbHeader,
  ) {
    const builder: Builder = new Builder();
    try {
      const authCrumbHeader = await this.makeAuthCrumbHeader();
      //Get config of job as JSON
      const jobConfigJson = await this.getJobConfigAsJson(jobName);
      console.log(JSON.stringify(jobConfigJson));
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
      handleAxiosError(error);
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
      handleAxiosError(error);
    }
  }

  async createJob(createPipelineDto: CreatePipelineDto) {
    const parser: Parser = new Parser();
    const builder: Builder = new Builder();
    const jobName = 'PipeReqTestCopy';
    const gitRepo = 'something else';

    const data = await this.httpService
      .get(`job/${jobName}/config.xml`)
      .pipe(map(response => response.data))
      .toPromise();

    try {
      //XML to JSON
      let json = await parser.parseStringPromise(data);
      // Update Git Repository
      json[
        'org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject'
      ].sources[0].data[0][
        'jenkins.branch.BranchSource'
      ][0].source[0].remote[0] = gitRepo;
      //JSON to XML
      const xml = builder.buildObject(json);
    } catch (error) {
      console.log(error);
    }
  }
}
