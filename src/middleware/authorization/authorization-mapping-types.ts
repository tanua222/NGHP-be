import { Request } from 'express';
import ResponseDto from '../../domain/dto/response.dto';
import Context from '../../utils/context';

export enum Source {
  body = 'body',
  header = 'header',
  query = 'query',
  path = 'path',
  function = 'function',
  value = 'value',
  helperService = 'helperService',
}

export enum Action {
  forbid = 'forbid',
  maskResponse = 'maskResponse',
  maskRequest = 'maskRequest',
}

export interface Evaluate {
  source: Source;
  param?: string;
  value?: string;
  fn?: (req: Request, pathParams?: any) => string;
  service?:
    | 'getCorpIdForOrder'
    | 'getCorpIdForEmergencyPlan'
    | 'getNodeIdListForEntityNodeIdList'
    | 'getNodeIdListForParentNodeId'
    | 'getNodeIdForNDEId'
    | 'getNodeIdListForNDEIdListAndParentNodeId'
    | 'getNodeIdListForAssignedReportIdList'
    | 'getNodeIdForAssignedReportId'
    | 'getCorporationIdForEntityNodeIdList'
    | 'getCorporationIdForHierarchyNodeIdList'
    | 'getCorporationIdForHierarchyNodeId'
    | 'getCorporationIdForNDEId'
    | 'getCorporationIdForAssignedReportIdList'
    | 'getCorporationIdForAssignedReportId';
  helperArguments?: { [key: string]: Evaluate | string };
}

export interface MaskDetails {
  path?: string;
}

export interface Condition {
  param: Evaluate;
  fn: (param: any) => boolean;
}

export interface AuthorizationDefinition {
  condition?: Condition | ((req: Request) => boolean);
  onFail?: Action | ((context: Context) => ResponseDto<null>);
  maskDetails?: MaskDetails;
  authorizationType: string | Evaluate;
  privilegeName?: string | string[] | Evaluate;
  hierarchyNodeId?: Evaluate;
  entityType?: string | Evaluate;
  entityId?: Evaluate;
  corporationId?: Evaluate;
  disabled?: boolean;
}

export interface AuthorizationMappingDefinition {
  path?: string;
  method: string;
  authorization: AuthorizationDefinition[];
  pathMatcher?: (p: string) => any;
}
