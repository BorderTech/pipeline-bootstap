interface Description {
  plain: Plain;
}

interface Plain {
  value: string;
  representation: string;
}

export interface CreateConfluenceSpaceRequestDto {
  key: string;
  name: string;
  description: Description;
}
