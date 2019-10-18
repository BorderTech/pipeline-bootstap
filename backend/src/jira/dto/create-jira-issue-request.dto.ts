interface Project {
  key: string;
}

interface Issuetype {
  name: string;
}

interface Reporter {
  name: string;
}

interface Fields {
  project: Project;
  summary: string;
  description: string;
  issuetype: Issuetype;
  reporter: Reporter;
}

export interface CreateJiraIssueRequestDto {
  fields: Fields;
}
