import { BaseDto } from './haa-common.dto';

export default class HaaAssignedUserReportDto extends BaseDto {
  parentHierarchyNodeId: string;
  parentHierarchyNodeName: string;
  parentHierarchyNodeLevel: number;
  parentNodeType: string;
  assignedReportId: string;
  reportCode: string;
  language: string;
  reportDescription: string;
  recipientLoginName: string;
  format: string;
  canUnassignIndicator: string;
}
