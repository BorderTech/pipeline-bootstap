interface StatusCategory {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}

interface To {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: StatusCategory;
}

interface Transition {
  id: string;
  name: string;
  to: To;
}

export interface GetJiraIssueTransitionsDto {
  expand: string;
  transitions: Transition[];
}
