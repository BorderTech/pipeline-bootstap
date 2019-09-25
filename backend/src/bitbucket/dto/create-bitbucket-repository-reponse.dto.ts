class Self {
  href: string;
}

class Links {
  self: Self[];
}

class Project {
  key: string;
  id: number;
  name: string;
  description: string;
  public: boolean;
  type: string;
  links: Links;
}

class Clone {
  href: string;
  name: string;
}

class LinksClone {
  clone: Clone[];
  self: Self[];
}

export class CreateBitbucketRepositoryResponseDto {
  slug: string;
  id: number;
  name: string;
  description: string;
  scmId: string;
  state: string;
  statusMessage: string;
  forkable: boolean;
  project: Project;
  public: boolean;
  links: LinksClone;
}
