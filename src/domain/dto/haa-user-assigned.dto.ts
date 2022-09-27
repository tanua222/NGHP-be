import { BaseDto } from './haa-common.dto';

export default class HaaUserAssignedDto extends BaseDto {
  userId: string;
  userFirstName: string;
  userLastName: string;
  userLogin: string;
  userEmail: string;
  parentHierarchyNodeId: string;
  parentHierarchyNodeName: string;
  parentHierarchyNodeLevel: number;
  parentNodeType: string;
  canUnassignIndicator: string;
}
