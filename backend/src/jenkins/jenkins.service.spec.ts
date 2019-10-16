import { Test, TestingModule } from '@nestjs/testing';
import { JenkinsService } from './jenkins.service';
import { CreatePipelineDto } from '../pipelines/dtos/create-pipeline.dto';
import { HttpService } from '@nestjs/common';
import * as path from 'path';
import { ConfigService } from '../config/config.service';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

const createPipelineDto: CreatePipelineDto = {
  requestor: 'Joe Citizen',
  projectType: 'software',
  projectName: 'My repo',
  projectDescription: 'My repo description',
  projectLead: 'ABC123',
  softwareMetadata: {
    projectTechLead: ['ABC123'],
    language: 'Java',
    kanbanBoardRequired: true,
  },
  businessMetadata: null,
  orgUnit: 'PIPEREQ Test Project',
  wbsCode: '11111',
};

const mockHttpService = () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
});

describe('JenkinsService', () => {
  let service: JenkinsService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const envFilePath = path.join(
      __dirname,
      `../../${process.env.NODE_ENV || 'test'}.env`,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JenkinsService,
        { provide: HttpService, useFactory: mockHttpService },
        {
          provide: ConfigService,
          useValue: new ConfigService(envFilePath),
        },
      ],
    }).compile();

    service = await module.get<JenkinsService>(JenkinsService);
    httpService = await module.get<HttpService>(HttpService);
    configService = await module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const jenkinsHtmlData =
    '<!DOCTYPE html><html><head></head><body></body></html>';

  describe('createJob', () => {
    it('should return a created jenkins job', async () => {
      const postReponse: AxiosResponse = {
        data: jenkinsHtmlData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
      const getResponse: AxiosResponse = {
        data: {
          _class: 'hudson.security.csrf.DefaultCrumbIssuer',
          crumb: '6b11dcc9d9e563627730e74c4757363f',
          crumbRequestField: 'Jenkins-Crumb',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      jest.spyOn(httpService, 'get').mockImplementation(() => of(getResponse));
      jest.spyOn(httpService, 'post').mockImplementation(() => of(postReponse));
      const copyJobResponse = await service.copyJob(
        'newJobName',
        'existingJobName',
        'gitUrlExample',
      );
      expect(copyJobResponse).toStrictEqual({
        name: 'newJobName',
        url: `${configService.jenkinsBaseURL}job/newJobName`,
      });
    });
  });
});
