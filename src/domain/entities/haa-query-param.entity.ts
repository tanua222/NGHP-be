import { Language } from '../../utils/constants';
import { PaginationParam, SortParam } from '../dto/haa-common.dto';
import BaseEntity from './base.entity';

export default class HaaQueryParams {
  corporationId?: number;
  hnId: string;
  parentHnId: string;
  userId?: string;
  entityId?: string;
  sortParams?: SortParam[];
  sortConditions?: string;
  paginationParam: PaginationParam;
  loginUser: string;
  lan: Language;

  entities: BaseEntity[];
}

export class HaaAssignedUserRoleListQueryParam extends HaaQueryParams {
  lastName: string;
  firstName: string;
  loginUserName: string;
  nodeName: string;
  nodeLevel: number;
}

export class HierarchyTreeQueryParams extends HaaQueryParams {
  drillDownHierarchyNodeId: string;
  startDate: string;
  endDate: string;
  maximumNodes: number;
  maximumLevels: number;
  includeWTN: boolean;
}

export class HierarchyNodeQueryParams extends HaaQueryParams {
  hierarchyNodeName: string;
  hierarchyNodeLevel: number;
  nodeId: string;
  nodeType: string;
  billingTelephoneNumber: string;
  excludeFromReportsFlag: string;
  hierarchyNodeId: string;
  effectiveDate: string;
  description1: string;
  description2: string;
  description3: string;
  reportingFlag: string;
  parentHierarchyNodeId: string;
  parentHierarchyNodeName: string;
  parentHierarchyNodeLevel: number;
  workingTelephoneNumber: string;
  permissionDescription: string[];
}

export class HaaAssignedEntity extends HaaQueryParams {
  parentHierarchyNodeName?: string;
  parentHierarchyNodeLevel?: number;
  parentHierarchyNodeId?: string;
}
export class HaaAssignedAccountCodeSetQueryParam extends HaaAssignedEntity {
  accountCodeSetCode: string;
  accountCodeSetName: string;
  permissionDescription: string[];
}

export class HaaAssignableAccountCodeSetQueryParam extends HaaQueryParams {
  accountCodeSetCode: string;
  accountCodeSetDescription: string;
}

export class HaaAssignableIdCodeSetQueryParam extends HaaQueryParams {
  idCodeSetCode: string;
  idCodeSetDescription: string;
}

export class HaaAssignAccountCodeSetQueryParam extends HaaQueryParams {
  hierarchyNodeId?: string;
  entitySequenceId?: string;
}
export class HaaAssignedIdCodeSetQueryParam extends HaaAssignedEntity {
  idCodeSetCode: string;
  idCodeSetDescription: string;
  permissionDescription: string[];
}

export class HaaAssignedTollfreeQueryParam extends HaaAssignedEntity {
  tollfreeNumber?: string;
  permissionDescription: string[];
}

export class HaaAssignedUserReportQueryParam extends HaaQueryParams {
  parentHierarchyNodeName?: string;
  parentHierarchyNodeLevel?: number;
  reportLan?: string;
  reportCode?: string;
  reportDescription?: string;
  recipientLoginName?: string;
  recipientUserId?: string;
  formatCode?: string;
}

export class HaaAssignableTollfreeQueryParam extends HaaQueryParams {
  tollfreeNumber?: string;
}

export class HaaUserReportDetailQueryParam extends HaaQueryParams {
  assignedReportId?: string;
}

export class HaaExtractsQueryParams extends HaaQueryParams {
  extractId: string;
}

export class HaaCreateExtractsQueryParams extends HaaQueryParams {
  hierarchyNodeId?: string;
  extractId?: number;
  userId?: string;
  conId?: number;
  languageCode?: Language;
  status?: string;
  extractFileName?: string;
  extractFile?: any;
  message?: string;
}

export class HomePageStatisticsQueryParam extends HaaQueryParams {
  telusInd?: string;
  webTZ?: string;
}

export class ExchangeGetQueryParam extends HaaQueryParams {
  filter?: string;
}

export class ExchangeAddQueryParam extends HaaQueryParams {
  abbreviation: string;
  bookNumber: string;
  createdTs: string;
  createdUserId: string;
  fullName: string;
  lastUpdatedTs: string;
  lastUpdatedUserId: string;
  npa: NpaExchangeQueryParam[];
  secondAbbreviation: string;
  sectionNumber: string;
}

export class NpaExchangeQueryParam {
  id: number;
  npa: string;
  // data from Exchange entity
  abbreviation: string;
  createdUserId: string;
  lastUpdatedUserId: string;
}