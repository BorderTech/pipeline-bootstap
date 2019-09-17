export class CreateJiraProjectRequestDto {
  key: string;
  name: string;
  projectTypeKey: string;
  projectTemplateKey: string;
  description: string;
  lead: string;
  assigneeType: string;
}
