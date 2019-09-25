import { Injectable, HttpService, Logger } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { CreatePipelineDto } from './../pipelines/dtos/create-pipeline.dto';
import { CreateBitbucketRepositoryRequestDto } from './dto/create-bitbucket-repository-request.dto';
import { CreateBitbucketRepositoryResponseDto } from './dto/create-bitbucket-repository-reponse.dto';
import { handleAxiosError } from '../common/errors/axios-error-handler';
import { ConfigService } from '../config/config.service';

@Injectable()
export class BitbucketService {
  private logger = new Logger('BitbucketService');

  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async createRepository(
    createPipelineDto: CreatePipelineDto,
  ): Promise<CreateBitbucketRepositoryResponseDto> {
    const createBitbucketRepositoryRequestDto: CreateBitbucketRepositoryRequestDto = this.makeCreateBitbucketRepositoryRequestDto(
      createPipelineDto,
    );
    try {
      this.logger.verbose(
        `Creating Bitbucket repository. Data: ${JSON.stringify(
          createBitbucketRepositoryRequestDto,
        )}`,
      );
      const createBitbucketRepositoryResponseDto: CreateBitbucketRepositoryResponseDto = await this.httpService
        .post(
          `/projects/${this.configService.bitbucketProject}/repos`,
          createBitbucketRepositoryRequestDto,
        )
        .pipe(map(response => response.data))
        .toPromise();
      this.logger.verbose(
        `Created Bitbucket repository. Data: ${JSON.stringify(
          createBitbucketRepositoryResponseDto,
        )}`,
      );
      return createBitbucketRepositoryResponseDto;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async deleteRepository(repositorySlug: string) {
    try {
      this.logger.verbose(`Deleting repository: ${repositorySlug}`);
      const data = await this.httpService.delete(
        `/projects/${
          this.configService.bitbucketProject
        }/repos/${repositorySlug}`,
      );
      this.logger.verbose(`Deleted repository: ${repositorySlug}`);
      return data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  private makeCreateBitbucketRepositoryRequestDto(
    createPipelineDto: CreatePipelineDto,
  ) {
    const createBitbucketRepositoryRequestDto: CreateBitbucketRepositoryRequestDto = {
      name: createPipelineDto.projectName,
      scmId: 'git',
    };
    return createBitbucketRepositoryRequestDto;
  }
}
