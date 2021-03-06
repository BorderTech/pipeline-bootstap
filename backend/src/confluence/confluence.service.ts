import { Injectable, HttpService, Inject, HttpException } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { CreatePipelineRequestDto } from '../pipeline-requests/dtos/create-pipeline-request.dto';
import { CreateConfluenceSpaceResponseDto } from './dto/create-space-request.dto';
import { CreateConfluenceSpaceRequestDto } from './dto/create-confluence-space-request.dto';
import { CreatePipelineDto } from '../pipelines/dtos/create-pipeline.dto';
import { handleAxiosError } from '../common/errors/axios-error-handler';
import { Logger } from 'winston';

@Injectable()
export class ConfluenceService {
  constructor(
    private readonly httpService: HttpService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async createSpace(
    createPipelineDto: CreatePipelineDto,
  ): Promise<CreateConfluenceSpaceResponseDto> {
    const createConfluenceSpaceRequest: CreateConfluenceSpaceRequestDto = this.makeCreateConfluenceSpaceRequestDto(
      createPipelineDto,
    );
    try {
      this.logger.debug(
        `Creating Confluence Space for project: ${
          createPipelineDto.projectName
        }.`,
        {
          label: 'ConfluenceService : createSpace',
          request: createConfluenceSpaceRequest,
        },
      );
      const confluenceSpace: CreateConfluenceSpaceResponseDto = await this.httpService
        .post(`/space`, createConfluenceSpaceRequest)
        .pipe(map(response => response.data))
        .toPromise();

      this.logger.debug(
        `Created Confluence Space for project: ${
          createPipelineDto.projectName
        }.`,
        {
          label: 'ConfluenceService : createSpace',
          space: confluenceSpace,
        },
      );

      return confluenceSpace;
    } catch (error) {
      // handleAxiosError(error);
      this.handleConfluenceError(error);
    }
  }

  async deleteSpace(spaceKey: string) {
    try {
      this.logger.verbose(`Deleting space: ${spaceKey}`);
      const data = await this.httpService
        .delete(`/space/${spaceKey}`)
        .pipe(map(response => response.data))
        .toPromise();
      this.logger.verbose(`Deleted space: ${spaceKey}`);
      return data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  private handleConfluenceError(error) {
    if (error.response) {
      let errorMessage = '';
      const { errors } = error.response.data.data;
      //Extract error messages form the array of errors returned
      errors.forEach(error => {
        errorMessage += `${error.message.translation}\n`;
      });
      throw new HttpException(errorMessage, error.response.status);
    }
  }

  private makeCreateConfluenceSpaceRequestDto(
    createRequestDto: CreatePipelineRequestDto,
  ): CreateConfluenceSpaceRequestDto {
    const createConfluenceSpaceRequestDto = {
      key: this.generateSpaceKey(createRequestDto.projectName),
      name: createRequestDto.projectName,
      description: {
        plain: {
          value: createRequestDto.projectDescription,
          representation: 'plain',
        },
      },
    };
    return createConfluenceSpaceRequestDto;
  }

  private generateSpaceKey(spaceName: string): string {
    let spaceKey: string = '';
    // Handling accented characters that WILL cause issues for Atlassian products
    const normalizedSpaceName: string = spaceName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const words: string[] = normalizedSpaceName.trim().split(' ');

    if (words.length > 1) {
      words.forEach(word => {
        let character = word[0];
        if (this.isLetter(character)) {
          spaceKey += word[0].toUpperCase();
          spaceKey = spaceKey.substring(0, 10);
        }
      });
    } else {
      spaceKey = normalizedSpaceName.substring(0, 10).toUpperCase();
    }
    return spaceKey;
  }

  private isLetter(str: String) {
    return str.length === 1 && str.match(/[a-z]/i);
  }
}
