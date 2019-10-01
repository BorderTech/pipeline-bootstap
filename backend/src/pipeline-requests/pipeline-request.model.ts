export interface PipelineRequest {
  id: string;
  projectType: string;
  projectName: string;
  projectDescription: string;
  projectLead: string;
  projectTechLead: string[];
  language: string;
  kanbanBoardRequired?: boolean;
  projectManagementRequired?: boolean;
  wbsCode: string;
  orgUnit: string;
  created: Date;
  status: string;
}
