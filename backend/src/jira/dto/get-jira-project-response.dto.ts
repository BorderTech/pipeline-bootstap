export class AvatarUrls {
  '48x48': string;
  '24x24': string;
  '16x16': string;
  '32x32': string;
}

export class Lead {
  self: string;
  name: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
}

export class Assignee {
  self: string;
  name: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
}

export class RealAssignee {
  self: string;
  name: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
}

export class Component {
  self: string;
  id: string;
  name: string;
  description: string;
  lead: Lead;
  assigneeType: string;
  assignee: Assignee;
  realAssigneeType: string;
  realAssignee: RealAssignee;
  isAssigneeTypeValid: boolean;
  project: string;
  projectId: number;
}

export class IssueType {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avatarId: number;
}

export class Roles {
  Developers: string;
}

export class ProjectCategory {
  self: string;
  id: string;
  name: string;
  description: string;
}

export class GetJiraProjectResponseDto {
  expand: string;
  self: string;
  id: string;
  key: string;
  description: string;
  lead: Lead;
  components: Component[];
  issueTypes: IssueType[];
  url: string;
  email: string;
  assigneeType: string;
  versions: any[];
  name: string;
  roles: Roles;
  avatarUrls: AvatarUrls;
  projectCategory: ProjectCategory;
  archived: boolean;
}
