interface Jira {
  key: string;
  name: string;
  url: string;
}

interface Confluence {
  key: string;
  name: string;
  url: string;
}

export interface Bitbucket {
  name: string;
  url: string;
}

export interface Jenkins {
  name: string;
  url: string;
}

export interface CreatePipelineResponseDto {
  jira?: Jira;
  confluence?: Confluence;
  bitbucket?: Bitbucket;
  jenkins?: Jenkins;
}
