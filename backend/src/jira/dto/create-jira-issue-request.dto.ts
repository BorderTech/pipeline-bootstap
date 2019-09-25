interface Project {
  key: string;
}

interface Issuetype {
  name: string;
}

interface Fields {
  project: Project;
  summary: string;
  description: string;
  issuetype: Issuetype;
}

export interface CreateJiraIssueRequestDto {
  fields: Fields;
}
