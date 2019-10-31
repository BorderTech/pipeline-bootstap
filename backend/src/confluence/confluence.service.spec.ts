import { Test, TestingModule } from '@nestjs/testing';
import { ConfluenceService } from './confluence.service';
import * as path from 'path';
import { HttpService } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { CreatePipelineDto } from '../pipelines/dtos/create-pipeline.dto';
import { CreateConfluenceSpaceResponseDto } from './dto/create-confluence-space-response.dto';

const mockHttpService = () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
});

const space: CreateConfluenceSpaceResponseDto = {
  id: 11,
  key: 'TPC',
  name: 'TEST Project Confluence',
  description: {
    plain: {
      value: 'This is an example space',
      representation: 'plain',
    },
  },
  metadata: {},
  _links: {
    collection: '/rest/api/space',
    base: 'http://example.com/confluence/',
    context: '/confluence',
    self: 'http://example.com/confluence/rest/api/space/TST',
  },
};

const mockCreateSpaceResponse = {
  id: 11,
  key: 'TPC',
  name: 'TEST Project Confluence',
  description: {
    plain: {
      value: 'This is an example space',
      representation: 'plain',
    },
  },
  metadata: {},
  _links: {
    collection: '/rest/api/space',
    base: 'http://example.com/confluence/',
    context: '/confluence',
    self: 'http://example.com/confluence/rest/api/space/TST',
  },
};

const createPipelineDto: CreatePipelineDto = {
  requestId: 1,
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

describe('ConfluenceService', () => {
  let service: ConfluenceService;
  let httpService: HttpService;

  beforeEach(async () => {
    const envFilePath = path.join(__dirname, `../../.env.example`);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfluenceService,
        { provide: HttpService, useFactory: mockHttpService },
        {
          provide: 'winston',
          useFactory: () => require('winston'),
        },
        {
          provide: ConfigService,
          useValue: new ConfigService(envFilePath),
        },
      ],
    }).compile();

    service = module.get<ConfluenceService>(ConfluenceService);
    httpService = await module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSpace', () => {
    it('should return a created confluence space', async () => {
      const result: AxiosResponse = {
        data: mockCreateSpaceResponse,
        status: 201,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      jest.spyOn(httpService, 'post').mockImplementation(() => of(result));
      expect(await service.createSpace(createPipelineDto)).toStrictEqual(space);
    });
  });

  describe('deleteSpace', () => {
    it('should return a deletion long running task response', async () => {
      const result: AxiosResponse = {
        data: {
          id: 'spaceUUID',
          links: {
            status: '/rest/api/longtask/spaceUUID',
          },
        },
        status: 202,
        statusText: 'OK',
        headers: {},
        config: {},
      };
      jest.spyOn(httpService, 'delete').mockImplementation(() => of(result));
      expect(await service.deleteSpace('spaceKey')).toStrictEqual({
        id: 'spaceUUID',
        links: {
          status: '/rest/api/longtask/spaceUUID',
        },
      });
    });
  });
});
