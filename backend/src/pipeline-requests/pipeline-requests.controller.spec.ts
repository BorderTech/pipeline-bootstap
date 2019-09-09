import { PipelineRequestsController } from './pipeline-requests.controller';
import { PipelineRequestsService } from './pipeline-requests.service';
import { PipelineRequest } from './pipeline-request.model';
import { JiraService } from '../jira/jira.service';
import { GetPipelineRequestFilterDto } from './dtos/get-pipeline-requests-fitler.dto';
import { CreatePipelineRequestDto } from './dtos/create-pipeline-request.dto';

describe('PipelineRequestsController', () => {
  let pipelineRequestsController: PipelineRequestsController;
  let pipelineRequestsService: PipelineRequestsService;
  let pipelineRequest: PipelineRequest;
  let createPipelineRequest: CreatePipelineRequestDto;
  let jiraService: JiraService;

  beforeEach(() => {
    pipelineRequestsService = new PipelineRequestsService(jiraService);
    pipelineRequestsController = new PipelineRequestsController(
      pipelineRequestsService,
    );
    pipelineRequest = {
      id: 'string',
      projectType: 'string',
      projectName: 'string',
      projectDescription: 'string',
      projectLead: 'string',
      projectTechLead: ['string[]'],
      language: 'string',
      kanbanBoardRequired: true,
      created: new Date('2019-09-06'),
      status: 'To Do',
      wbsCode: 'string',
    };
    createPipelineRequest = {
      projectType: 'string',
      projectName: 'string',
      projectDescription: 'string',
      projectLead: 'string',
      projectTechLead: ['string[]'],
      language: 'string',
      kanbanBoardRequired: true,
      wbsCode: 'string',
      orgUnit: 'string',
    };
  });

  describe('findAll', () => {
    it('should return an array of PipelineRequest', async () => {
      const result = Promise.resolve([pipelineRequest]);
      jest
        .spyOn(pipelineRequestsService, 'findAll')
        .mockImplementation(() => result);
      let filterDto = new GetPipelineRequestFilterDto();
      expect(await pipelineRequestsController.findAll(filterDto)).toStrictEqual(
        [pipelineRequest],
      );
    });
  });

  describe('findOne', () => {
    it('should return a PipelineRequest', async () => {
      const result = Promise.resolve(pipelineRequest);
      jest
        .spyOn(pipelineRequestsService, 'findOne')
        .mockImplementation(() => result);
      expect(await pipelineRequestsController.findOne('string')).toStrictEqual(
        pipelineRequest,
      );
    });
  });

  describe('createRequest', () => {
    it('should return a created PipelineRequest', async () => {
      const result = Promise.resolve(pipelineRequest);
      jest
        .spyOn(pipelineRequestsService, 'createRequest')
        .mockImplementation(() => result);
      expect(
        await pipelineRequestsController.createRequest(createPipelineRequest),
      ).toStrictEqual(pipelineRequest);
    });
  });
});
