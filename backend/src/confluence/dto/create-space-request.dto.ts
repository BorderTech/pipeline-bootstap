interface Plain {
  value: string;
  representation: string;
}

interface Expandable {
  view: string;
}

interface Description {
  plain: Plain;
  _expandable: Expandable;
}

interface Extensions {
  position: string;
}

interface Links {
  webui: string;
  edit: string;
  tinyui: string;
  self: string;
}

interface Homepage {
  id: string;
  type: string;
  status: string;
  title: string;
  extensions: Extensions;
  _links: Links;
  _expandable: Expandable;
}

export interface CreateConfluenceSpaceResponseDto {
  id: number;
  key: string;
  name: string;
  description: Description;
  homepage?: Homepage;
  type?: string;
  _links: Links;
  _expandable?: Expandable;
}
