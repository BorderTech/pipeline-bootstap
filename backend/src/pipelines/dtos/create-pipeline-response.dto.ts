import { ApiModelProperty } from '@nestjs/swagger';

class Jira {
  @ApiModelProperty()
  key: string;
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  url: string;
}

class Confluence {
  @ApiModelProperty()
  key: string;
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  url: string;
}

export class Bitbucket {
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  url: string;
}

export class Jenkins {
  @ApiModelProperty()
  key: string;
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  url: string;
}

export class CreatePipelineResponseDto {
  @ApiModelProperty()
  jira?: Jira;
  @ApiModelProperty()
  confluence?: Confluence;
  @ApiModelProperty()
  bitbucket?: Bitbucket;
  @ApiModelProperty()
  jenkins?: Jenkins;
}
