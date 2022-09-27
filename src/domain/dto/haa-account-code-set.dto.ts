import { BaseDto } from './haa-common.dto';
import { EntityParentHierarchyNodeDto } from './haa-entity-parent-hierarchy-node.dto';

export class HaaAssignedAccountCodeSetDto extends EntityParentHierarchyNodeDto {
  accountCodeSetCode: string;
  accountCodeSetName: string;
  accountCodeSetLength: number;
  entityNodeId: string;
  entityId: string;
  entitySequenceId: string;
  entityNodeEffectiveDate: string;
}
export class HaaAssignableAccountCodeSetDto extends BaseDto {
  entitySequenceId: string;
  accountCodeSetCode: string;
  accountCodeSetDescription: string;
  accountCodeSetLength: number;
  effectiveDate: string;
}
export class HaaAssignAccountCodeSetDto extends BaseDto {
  entitySequenceId: string;
  parentHierarchyNodeId: string;
}
