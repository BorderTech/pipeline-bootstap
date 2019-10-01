import { Injectable, HttpService, Inject } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { CreatePipelineDto } from './../pipelines/dtos/create-pipeline.dto';
import { CreateBitbucketRepositoryRequestDto } from './dto/create-bitbucket-repository-request.dto';
import { CreateBitbucketRepositoryResponseDto } from './dto/create-bitbucket-repository-reponse.dto';
import { handleAxiosError } from '../common/errors/axios-error-handler';
import { ConfigService } from '../config/config.service';
import { Logger } from 'winston';

@Injectable()
export class BitbucketService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async createRepository(
    createPipelineDto: CreatePipelineDto,
  ): Promise<CreateBitbucketRepositoryResponseDto> {
    const createBitbucketRepositoryRequestDto: CreateBitbucketRepositoryRequestDto = this.makeCreateBitbucketRepositoryRequestDto(
      createPipelineDto,
    );
    try {
      this.logger.debug(
        `Creating Bitbucket repository for project ${
          createPipelineDto.projectName
        }.`,
        {
          label: 'BitbucketService : createRepository',
          request: createBitbucketRepositoryRequestDto,
        },
      );

      const createBitbucketRepositoryResponseDto: CreateBitbucketRepositoryResponseDto = await this.httpService
        .post(
          `/projects/${this.configService.bitbucketProject}/repos`,
          createBitbucketRepositoryRequestDto,
        )
        .pipe(map(response => response.data))
        .toPromise();

      this.logger.debug(
        `Created Bitbucket repository for project ${
          createPipelineDto.projectName
        }.`,
        {
          label: 'BitbucketService : createRepository',
          repository: createBitbucketRepositoryResponseDto,
        },
      );
      return createBitbucketRepositoryResponseDto;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async deleteRepository(repositorySlug: string) {
    try {
      this.logger.verbose(`Deleting repository: ${repositorySlug}`);
      const data = await this.httpService
        .delete(
          `/projects/${
            this.configService.bitbucketProject
          }/repos/${repositorySlug}`,
        )
        .pipe(map(response => response.data))
        .toPromise();
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
