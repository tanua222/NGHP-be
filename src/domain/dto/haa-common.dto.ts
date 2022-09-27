import { AppConfig } from '../../utils/app-config';
import { Language } from '../../utils/constants';
const config = <AppConfig>require('config');

export class BaseDto {}

export class HaaBaseDto {}

export class HaaFeatureBaseDto extends HaaBaseDto {}

export class SortParam {
  fieldName: string;
  asc: boolean;
}

export class PaginationParam {
  // in case offset and limit are not sent as part of input
  // it would behave as non-paginated way based on this ignoreServicePagination flag
  ignoreServicePagination: boolean = false;
  paginationRequired: boolean = false;
  offset: number = Number(config.pagination.defaultOffset);
  limit: number = Number(config.pagination.defaultLimit);
}
export class RequestParam {
  corporationId?: number;
  hierarchyNodeId?: string;
  parentHierarchyNodeId?: string;
  userId?: string;
  entityId?: string;
  sortParams?: SortParam[];
  paginationParam: PaginationParam;
  loginUser: string;
  inputRequest: any;
  // for features it could be numbers or strings
  // ( e.g. for features with seqNumber it would be number but for TN it would be TN which is string)
  // so making it string , based on requirement casting might be needed
  entityIdsToDelete: string[];
  languageHeader?: string;
}

export class AssignedUsersRequestParam extends RequestParam {
  parentHierarchyNodeName?: string;
  parentHierarchyNodeLevel?: string;
  userLastName?: string;
  userFirstName?: string;
  userLogin?: string;
}

export class AssginedEntityRequestParam extends RequestParam {
  parentHierarchyNodeName?: string;
  parentHierarchyNodeLevel?: string;
  parentHierarchyNodeId?: string;
}
export class AssignedAccountCodeSetRequestParam extends AssginedEntityRequestParam {
  accountCodeSetCode?: string;
  accountCodeSetName?: string;
}
export class AssignableAccountCodeSetRequestParam extends RequestParam {
  accountCodeSetCode?: string;
  accountCodeSetDescription?: string;
}
export class AssignAccountCodeSetRequestParam extends RequestParam {
  entitySequenceId?: string;
}
export class AssignedIdCodeSetRequestParam extends AssginedEntityRequestParam {
  idCodeSetCode?: string;
  idCodeSetDescription?: string;
}

export class AssignableIdCodeSetRequestParam extends RequestParam {
  idCodeSetCode?: string;
  idCodeSetDescription?: string;
}

export class AssignedTollfreeRequestParam extends AssginedEntityRequestParam {
  tollfreeNumber?: string;
}

export enum DtoAction {
  add = 'add',
  modify = 'modify',
  delete = 'delete',
  NOC = 'noChange', // no change
  // UPD = 'UPD',
  UNDEFINED = '',
}

export class HierarchyTreeRequestParam extends RequestParam {
  drillDownHierarchyNodeId?: string;
  startDate?: string;
  endDate?: string;
  maximumNodes?: number;
  maximumLevels?: number;
  includeWTN?: boolean;
}

export class HierarchyNodeRequestParam extends RequestParam {
  hierarchyNodeName?: string;
  hierarchyNodeLevel?: number;
  nodeId?: string;
  nodeType?: string;
  billingTelephoneNumber?: string;
  workingTelephoneNumber?: string;
  excludeFromReportCode?: string;
  parentHierarchyNodeId?: string;
  parentHierarchyNodeName?: string;
  parentHierarchyNodeLevel?: number;
}

export class AssignedUserReportRequestParam extends RequestParam {
  parentHierarchyNodeName: string;
  parentHierarchyNodeLevel: string;
  reportCode?: string;
  reportDescription?: string;
  recipientLoginName?: string;
  language?: string;
  recipientUserId?: string;
  formatCode?: string;
}

export class AssignableTollfreeRequestParam extends RequestParam {
  tollfreeNumber?: string;
}

export class UserReportDetailRequestParam extends RequestParam {
  assignedReportId?: string;
}

export class UserReportAssignInputRequestParam {
  parentHierarchyNodeId: string;
  reportId: number[];
  format: string;
  language: string;
  recipientUserId: string;
}

export class UserReportUnassignInputRequestParam {
  assignedReportId: string;
}

export class NodeEntityUnassignInputRequestParam {
  entityNodeId: string;
}

export class NodeEntityAssignInputRequestParam {
  parentHierarchyNodeId: string;
  entitySequenceId: string;
}

export class UserReportReassignInputRequestParam extends UserReportAssignInputRequestParam {
  assignedReportId: string[];
}

export class WtnMoveInputRequestParam {
  targetParentHierarchyNodeId: string;
  wtnNodeId: string[];
}

export class NodeMoveInputRequestParam {
  targetParentHierarchyNodeId: string;
  nodeId: string[];
}

export class NodeEntityRequestParam extends RequestParam {
  entityType?: string;
}

export class HaaExtractCreateRequestParam extends RequestParam{
  language?: Language;
}
