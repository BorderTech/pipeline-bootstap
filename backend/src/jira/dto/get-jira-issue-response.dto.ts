export class Issuetype {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avatarId: number;
}

export class Project {
  self: string;
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  avatarUrls: AvatarUrls;
}

export class Watches {
  self: string;
  watchCount: number;
  isWatching: boolean;
}

export class AvatarUrls {
  '48x48': string;
  '24x24': string;
  '16x16': string;
  '32x32': string;
}

export class Creator {
  self: string;
  name: string;
  key: string;
  emailAddress: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
}

export class Reporter {
  self: string;
  name: string;
  key: string;
  emailAddress: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
}

export class Aggregateprogress {
  progress: number;
  total: number;
}

export class Priority {
  self: string;
  iconUrl: string;
  name: string;
  id: string;
}

export class Progress {
  progress: number;
  total: number;
}

export class Votes {
  self: string;
  votes: number;
  hasVoted: boolean;
}

export class StatusCategory {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}

export class Status {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: StatusCategory;
}

export class Fields {
  issuetype: Issuetype;
  components: any[];
  timespent?: any;
  timeoriginalestimate?: any;
  description: string;
  project: Project;
  fixVersions: any[];
  aggregatetimespent?: any;
  resolution?: any;
  customfield_10006?: any;
  customfield_10007: string;
  customfield_10008?: any;
  aggregatetimeestimate?: any;
  resolutiondate?: any;
  workratio: number;
  summary: string;
  lastViewed: Date;
  watches: Watches;
  creator: Creator;
  subtasks: any[];
  created: Date;
  reporter: Reporter;
  aggregateprogress: Aggregateprogress;
  priority: Priority;
  customfield_10100: string;
  customfield_10002?: any;
  labels: any[];
  environment?: any;
  timeestimate?: any;
  aggregatetimeoriginalestimate?: any;
  versions: any[];
  duedate?: any;
  progress: Progress;
  issuelinks: any[];
  votes: Votes;
  assignee?: any;
  updated: Date;
  status: Status;
}

export class GetJiraIssueResponseDto {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: Fields;
}
