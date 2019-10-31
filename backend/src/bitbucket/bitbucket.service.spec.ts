import { Test, TestingModule } from '@nestjs/testing';
import { BitbucketService } from './bitbucket.service';
import { CreateBitbucketRepositoryResponseDto } from './dto/create-bitbucket-repository-reponse.dto';
import { CreatePipelineDto } from '../pipelines/dtos/create-pipeline.dto';
import { HttpService } from '@nestjs/common';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigService } from '../config/config.service';
import * as path from 'path';

const mockHttpService = () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
});

const repository: CreateBitbucketRepositoryResponseDto = {
  slug: 'my-repo',
  id: 1,
  name: 'My repo',
  description: 'My repo description',
  scmId: 'git',
  state: 'AVAILABLE',
  statusMessage: 'Available',
  forkable: true,
  project: {
    key: 'PRJ',
    id: 1,
    name: 'My Cool Project',
    description: 'The description for my cool project.',
    public: true,
    type: 'NORMAL',
    links: {
      self: [
        {
          href: 'http://link/to/project',
        },
      ],
    },
  },
  public: true,
  links: {
    clone: [
      {
        href: 'ssh://git@<baseURL>/PRJ/my-repo.git',
        name: 'ssh',
      },
      {
        href: 'https://<baseURL>/scm/PRJ/my-repo.git',
        name: 'http',
      },
    ],
    self: [
      {
        href: 'http://link/to/repository',
      },
    ],
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

const mockCreateRepositoryResponse = {
  slug: 'my-repo',
  id: 1,
  name: 'My repo',
  description: 'My repo description',
  scmId: 'git',
  state: 'AVAILABLE',
  statusMessage: 'Available',
  forkable: true,
  project: {
    key: 'PRJ',
    id: 1,
    name: 'My Cool Project',
    description: 'The description for my cool project.',
    public: true,
    type: 'NORMAL',
    links: {
      self: [
        {
          href: 'http://link/to/project',
        },
      ],
    },
  },
  public: true,
  links: {
    clone: [
      {
        href: 'ssh://git@<baseURL>/PRJ/my-repo.git',
        name: 'ssh',
      },
      {
        href: 'https://<baseURL>/scm/PRJ/my-repo.git',
        name: 'http',
      },
    ],
    self: [
      {
        href: 'http://link/to/repository',
      },
    ],
  },
};

describe('BitbucketService', () => {
  let service: BitbucketService;
  let httpService: HttpService;

  beforeEach(async () => {
    const envFilePath = path.join(__dirname, `../../.env.example`);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BitbucketService,
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

    service = await module.get<BitbucketService>(BitbucketService);
    httpService = await module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRepository', () => {
    it('should return a created bitbucket repository', async () => {
      const result: AxiosResponse = {
        data: mockCreateRepositoryResponse,
        status: 201,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      jest.spyOn(httpService, 'post').mockImplementation(() => of(result));
      expect(await service.createRepository(createPipelineDto)).toStrictEqual(
        repository,
      );
    });
  });

  describe('deleteRepository', () => {
    it('should return a scheduled for deletion response', async () => {
      const result: AxiosResponse = {
        data: {
          context: null,
          message: 'Repository scheduled for deletion.',
          exceptionName: null,
        },
        status: 202,
        statusText: 'OK',
        headers: {},
        config: {},
      };
      jest.spyOn(httpService, 'delete').mockImplementation(() => of(result));
      expect(await service.deleteRepository('slug')).toStrictEqual({
        context: null,
        message: 'Repository scheduled for deletion.',
        exceptionName: null,
      });
    });
  });
});
