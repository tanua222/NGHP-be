import { BaseDto } from './haa-common.dto';

export class EntityParentHierarchyNodeDto extends BaseDto {
  parentHierarchyNodeName: string;
  parentHierarchyNodeLevel: number;
  parentNodeType: string;
  parentHierarchyNodeId: string;
  canUnassignIndicator: string;
}
