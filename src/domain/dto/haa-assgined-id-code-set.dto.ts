import { EntityParentHierarchyNodeDto } from './haa-entity-parent-hierarchy-node.dto';

export default class HaaAssignedIdCodeSetDto extends EntityParentHierarchyNodeDto {
  entityNodeId: string;
  entitySequenceId: string;
  entityId: string;
  idCodeSetCode: string;
  idCodeSetDescription: string;
  idCodeSetType: string;
  idCodeSetLength: number;
  entityNodeEffectiveDate: string;
}
