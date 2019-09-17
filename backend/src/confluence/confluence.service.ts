import {
  Injectable,
  HttpService,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { CreatePipelineRequestDto } from '../pipeline-requests/dtos/create-pipeline-request.dto';
import { CreateConfluenceSpaceResponseDto } from './dto/create-space-request.dto';
import { CreateConfluenceSpaceRequestDto } from './dto/create-confluence-space-request.dto';

@Injectable()
export class ConfluenceService {
  constructor(private readonly httpService: HttpService) {}

  async createSpace(
    createRequestDto: CreatePipelineRequestDto,
  ): Promise<CreateConfluenceSpaceResponseDto> {
    let createConfluenceSpaceResponseDto: CreateConfluenceSpaceResponseDto;
    const createConfluenceSpaceRequest: CreateConfluenceSpaceRequestDto = this.makeCreateConfluenceSpaceRequestDto(
      createRequestDto,
    );
    try {
      createConfluenceSpaceResponseDto = await this.httpService
        .post(`/space`, createConfluenceSpaceRequest)
        .pipe(map(response => response.data))
        .toPromise();

      return createConfluenceSpaceResponseDto;
    } catch (error) {
      if (error.response.data) {
        console.log('Confluence error', error.response.data);
        if (error.response.status === 400) {
          const errorMessage = { confluence: error.response.data };
          throw new BadRequestException(errorMessage);
        }
      } else {
        // We malfunctioned somehow - not the users fault
        throw new InternalServerErrorException(error);
      }
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
