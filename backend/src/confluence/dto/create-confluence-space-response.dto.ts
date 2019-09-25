interface Plain {
  value: string;
  representation: string;
}

interface Description {
  plain: Plain;
}

interface Metadata {}

interface Links {
  collection: string;
  base: string;
  context: string;
  self: string;
}

export interface CreateConfluenceSpaceResponseDto {
  id: number;
  key: string;
  name: string;
  description: Description;
  metadata: Metadata;
  _links: Links;
}
