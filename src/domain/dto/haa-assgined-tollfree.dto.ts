import { EntityParentHierarchyNodeDto } from './haa-entity-parent-hierarchy-node.dto';

export default class HaaAssignedTollfreetDto extends EntityParentHierarchyNodeDto {
  entityNodeId: string;
  entitySequenceId: string;
  entityId: string;
  tollfreeNumber: string;
  tollfreeVanityNumber: string;
  entityNodeEffectiveDate: string;
}
