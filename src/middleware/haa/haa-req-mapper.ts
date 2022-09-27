import { Request, Response } from 'express';
import {
  AssginedEntityRequestParam,
  AssignableTollfreeRequestParam,
  AssignedUserReportRequestParam,
  AssignedUsersRequestParam,
  HaaExtractCreateRequestParam,
  HierarchyNodeRequestParam,
  HierarchyTreeRequestParam,
  PaginationParam,
  RequestParam,
  SortParam,
  UserReportDetailRequestParam,
} from '../../domain/dto/haa-common.dto';
import { AppConfig } from '../../utils/app-config';
import { COMMA_SEPARATOR, ENTITY_TYPE, GUI_SORT_DESC_OPERATOR, Language } from '../../utils/constants';
import { getLoginUser, isNull, getLanguageCode } from '../../utils/util';
import { NodeEntityRequestParam } from '../../domain/dto/haa-common.dto';
const config = <AppConfig>require('config');

/**
 * create a different implmentation of these functions
 * and pass the object to post/delete etc mapping function
 * if different mapping is needed for a specific functions
 */
export class MapRequestFunctions {
  mapReqForPost: Function = (req: Request) => {
    return req.body;
  };
  mapReqForDelete: Function = (req: Request) => {
    return [req.params.entityId];
  };
  mapReqForPatch: Function = (req: Request) => {
    return req.body;
  };
}

export const mapCommonGetReqToRequestParam = <T extends RequestParam>(
  req: Request,
  res: Response,
  requestParam: T
): T => {
  const context = res.locals.context;
  context.log.debug('mapFeatureGetReqToRequestParam triggered');
  const queryParam: any = req.query;
  // const pathParam: any = req.params;
  const headers: any = req.headers;

  requestParam.languageHeader = req.headers?.['accept-language'];

  requestParam.paginationParam = new PaginationParam();
  if (isNull(queryParam?.limit) && isNull(queryParam?.offset)) {
    requestParam.paginationParam.ignoreServicePagination = true;
    requestParam.paginationParam.paginationRequired = false;
  } else {
    requestParam.paginationParam.limit =
      queryParam?.limit && queryParam?.limit >= 0 ? Number(queryParam?.limit) : Number(config.pagination.defaultLimit);
    requestParam.paginationParam.offset =
      queryParam?.offset && queryParam?.offset >= 0
        ? Number(queryParam?.offset)
        : Number(config.pagination.defaultOffset);
  }

  queryParam?.sort &&
    queryParam?.sort?.length > 1 &&
    (requestParam.sortParams = queryParam?.sort
      .split(COMMA_SEPARATOR)
      .filter((n1: string) => !isNull(n1))
      .map((s1: string) => {
        const sortParam = new SortParam();
        s1.startsWith(GUI_SORT_DESC_OPERATOR)
          ? ((sortParam.fieldName = s1.substring(1)), (sortParam.asc = false))
          : ((sortParam.fieldName = s1), (sortParam.asc = true));
        return sortParam;
      }));

  return requestParam;
};

const mapCommonFeatureReqToRequestParam = (req: Request, res: Response, requestParam: RequestParam) => {
  const context = res.locals.context;
  context.log.debug('mapCommonFeatureReqToRequestParam triggered');

  const queryParam: any = req.query;
  const pathParam: any = req.params;

  // map all possible query params
  requestParam.corporationId = queryParam?.corporationId || pathParam?.corporationId || req.body.corporationId;
  requestParam.hierarchyNodeId = queryParam?.hierarchyNodeId || pathParam?.hierarchyNodeId || req.body.hierarchyNodeId;
  requestParam.parentHierarchyNodeId =
    queryParam?.parentHierarchyNodeId || pathParam?.parentHierarchyNodeId || req.body.parentHierarchyNodeId;
  requestParam.userId = queryParam?.userId || pathParam?.userId || req.body.userId;
  pathParam?.entityId && (requestParam.entityId = pathParam?.entityId);

  requestParam.loginUser = getLoginUser(context, queryParam.uuid);

  context.log.debug('mapCommonFeatureReqToRequestParam success with requestParam', requestParam);
  return requestParam;
};

export const mapFeatureGetReqToRequestParam = (req: Request, res: Response) => {
  const context = res.locals.context;
  context.log.debug('mapFeatureGetReqToRequestParam triggered');
  let requestParam = mapCommonGetReqToRequestParam(req, res, new RequestParam());
  requestParam = mapCommonFeatureReqToRequestParam(req, res, requestParam);

  context.log.debug('mapFeatureGetReqToRequestParam success with requestParam', requestParam);
  return requestParam;
};

export const mapFeaturePostReqToRequestParam = (req: Request, res: Response, mapReqFunctions: MapRequestFunctions) => {
  const context = res.locals.context;
  context.log.debug('mapFeaturePostReqToRequestParam triggered');
  const requestParam = mapCommonFeatureReqToRequestParam(req, res, new RequestParam());
  requestParam.inputRequest = mapReqFunctions.mapReqForPost(req);
  context.log.debug('mapFeaturePostReqToRequestParam success with requestParam', requestParam);
  return requestParam;
};

// TODO add an object with function
export const mapFeatureDeleteReqToRequestParam = (
  req: Request,
  res: Response,
  mapReqFunctions: MapRequestFunctions
) => {
  const context = res.locals.context;
  context.log.debug('mapFeatureDeleteReqToRequestParam triggered');
  const requestParam = mapCommonFeatureReqToRequestParam(req, res, new RequestParam());
  requestParam.entityIdsToDelete = mapReqFunctions.mapReqForDelete(req);
  context.log.debug('mapFeatureDeleteReqToRequestParam success with requestParam', requestParam);
  return requestParam;
};

export const mapFeaturePatchReqToRequestParam = (req: Request, res: Response, mapReqFunctions: MapRequestFunctions) => {
  const context = res.locals.context;
  context.log.debug('mapFeaturePostReqToRequestParam triggered');
  const requestParam = mapCommonFeatureReqToRequestParam(req, res, new RequestParam());
  requestParam.inputRequest = mapReqFunctions.mapReqForPatch(req);
  context.log.debug('mapFeaturePostReqToRequestParam success with requestParam', requestParam);
  return requestParam;
};

export const mapInputToRequestParam = (req: Request, res: Response) => {
  const context = res.locals.context;
  const requestParam = new RequestParam();

  const { orderId }: any = req.params;

  if (!context.uuid) {
    context.set('uuid', req.query.uuid);
  }

  requestParam.inputRequest = req.body;

  context.log.debug('mapSubscriptionOrderPatchToRequestParam success with requestParam', requestParam);
  return requestParam;
};

export const mapPaginatingListReqToRequestParam = (req: Request, res: Response) => {
  const context = res.locals.context;
  context.log.debug('mapPaginatingListReqToRequestParam triggered');
  const requestParam: any = mapCommonGetReqToRequestParam(req, res, new RequestParam());
  // required override in case client didn't pass pagination params
  requestParam.paginationParam.ignoreServicePagination = false; 
  requestParam.paginationParam.paginationRequired = true; 

  Object.assign(requestParam, req.query);

  requestParam.loginUser = getLoginUser(context, requestParam.uuid);

  context.log.debug('mapPaginatingListReqToRequestParam success with requestParam', requestParam);
  return requestParam;
};

export const mapAssignedUserReportReqToRequestParam = (req: Request, res: Response) => {
  const context = res.locals.context;
  context.log.debug('mapAssignedUserReportReqToRequestParam triggered');
  const requestParam: any = mapCommonGetReqToRequestParam(req, res, new AssignedUserReportRequestParam());
  // required override in case client didn't pass pagination params
  requestParam.paginationParam.ignoreServicePagination = false;
  requestParam.paginationParam.paginationRequired = true;

  Object.assign(requestParam, req.query);

  requestParam.loginUser = getLoginUser(context, requestParam.uuid);

  context.log.debug('mapAssignedUserReportReqToRequestParam success with requestParam', requestParam);
  return requestParam;
};

export const mapTreePostReqToRequestParam = (req: Request, res: Response, mapReqFunctions: MapRequestFunctions) => {
  const context = res.locals.context;
  context.log.debug('mapTreePostReqToRequestParam triggered');
  const requestParam: HierarchyTreeRequestParam = mapCommonFeatureReqToRequestParam(
    req,
    res,
    new HierarchyTreeRequestParam()
  );

  const { drillDownHierarchyNodeId, startDate, endDate, maximumNodes, maximumLevels, includeWTN }: any = req.query;

  // requestParam.drillDownHierarchyNodeId = drillDownHierarchyNodeId;
  // requestParam.startDate = startDate;
  // requestParam.endDate = endDate;
  // requestParam.maximumNodes = maximumNodes;
  // requestParam.maximumLevels = Number(maximumLevels);
  // requestParam.includeWTN = includeWTN ? JSON.parse(includeWTN) : false; //default as false?

  // requestParam.inputRequest = mapReqFunctions.mapReqForPost(req);
  context.log.debug('mapTreePostReqToRequestParam success with requestParam', requestParam);
  return requestParam;
};

export const mapEntityPostReqToRequestParam = (entityType: ENTITY_TYPE) => {
  return (req: Request, res: Response, mapReqFunctions: MapRequestFunctions) => {
    const context = res.locals.context;
    context.log.debug('mapTreePostReqToRequestParam triggered');
    const requestParam: NodeEntityRequestParam = mapCommonFeatureReqToRequestParam(
      req,
      res,
      new NodeEntityRequestParam()
    );

    requestParam.entityType = entityType;

    requestParam.inputRequest = mapReqFunctions.mapReqForPost(req);
    context.log.debug('mapTreePostReqToRequestParam success with requestParam', requestParam);
    return requestParam;
  };
};

export const mapHaaExtractCreateReqToRequestParam = (req: Request,res:Response)=>{
  const context = res.locals.context;
  context.log.debug('mapHaaExtractCreateReqToRequestParam triggered');

  const queryParam: any = req.query;

  let requestParam = new HaaExtractCreateRequestParam()
  requestParam.hierarchyNodeId = queryParam?.hierarchyNodeId 
  requestParam.language = getLanguageCode(req.headers['accept-language']!)
  context.log.debug('mapCommonFeatureReqToRequestParam success with requestParam', requestParam);
  return requestParam;
}

export const mapNodeGetReqToRequestParam = (req: Request, res: Response) => {
  const context = res.locals.context;
  context.log.debug('mapNodeGetReqToRequestParam triggered');
  let requestParam = mapCommonGetReqToRequestParam(req, res, new HierarchyNodeRequestParam());
  requestParam = mapCommonFeatureReqToRequestParam(req, res, requestParam);

  const {
    nodeId,
    hierarchyNodeName,
    hierarchyNodeLevel,
    nodeType,
    parentHierarchyNodeId,
    parentHierarchyNodeName,
    parentHierarchyNodeLevel,
    workingTelephoneNumber,
    billingTelephoneNumber,
    excludeFromReportCode,
  }: any = req.query;

  requestParam.nodeId = nodeId;
  requestParam.hierarchyNodeName = hierarchyNodeName;
  requestParam.hierarchyNodeLevel = hierarchyNodeLevel;
  requestParam.nodeType = nodeType;
  requestParam.parentHierarchyNodeId = parentHierarchyNodeId;
  requestParam.parentHierarchyNodeName = parentHierarchyNodeName;
  requestParam.parentHierarchyNodeLevel = parentHierarchyNodeLevel;
  requestParam.workingTelephoneNumber = workingTelephoneNumber;
  requestParam.billingTelephoneNumber = billingTelephoneNumber;
  requestParam.excludeFromReportCode = excludeFromReportCode;
  requestParam.nodeId = req.params.nodeId;

  context.log.debug('mapNodeGetReqToRequestParam success with requestParam', requestParam);
  return requestParam;
};

export const mapNodeReqToRequestParam = (req: Request, res: Response, mapReqFunctions: MapRequestFunctions) => {
  const context = res.locals.context;
  context.log.debug('mapNodePatchReqToRequestParam triggered');
  const requestParam: HierarchyNodeRequestParam = mapCommonFeatureReqToRequestParam(
    req,
    res,
    new HierarchyNodeRequestParam()
  );
  requestParam.inputRequest = mapReqFunctions.mapReqForPatch(req);
  context.log.debug('mapNodePatchReqToRequestParam success with requestParam', requestParam);

  const { nodeId }: any = req.params;

  requestParam.nodeId = nodeId;

  return requestParam;
};

export const mapUpdateUserReportReqToRequestParam = (
  req: Request,
  res: Response,
  mapReqFunctions: MapRequestFunctions
) => {
  const context = res.locals.context;
  context.log.debug('mapUpdateUserReportReqToRequestParam triggered');
  const requestParam: UserReportDetailRequestParam = mapCommonFeatureReqToRequestParam(
    req,
    res,
    new UserReportDetailRequestParam()
  );
  requestParam.inputRequest = mapReqFunctions.mapReqForPatch(req);
  context.log.debug('mapUpdateUserReportReqToRequestParam success with requestParam', requestParam);

  const { assignedReportId }: any = req.params;

  requestParam.assignedReportId = assignedReportId;

  return requestParam;
};

export const mapUserReportDetailReqToRequestParam = (req: Request, res: Response) => {
  const context = res.locals.context;
  context.log.debug('mapUserReportDetailReqToRequestParam triggered');
  let requestParam = mapCommonGetReqToRequestParam(req, res, new UserReportDetailRequestParam());
  requestParam = mapCommonFeatureReqToRequestParam(req, res, requestParam);

  context.log.debug('mapUserReportDetailReqToRequestParam success with requestParam', requestParam);

  const { assignedReportId }: any = req.params;

  requestParam.assignedReportId = assignedReportId;

  return requestParam;
};

export const mapEntityReqToRequestParam = (req: Request, res: Response) => {
  const context = res.locals.context;
  context.log.debug('mapEntityReqToRequestParam triggered');
  const requestParam: any = mapCommonGetReqToRequestParam(req, res, new AssginedEntityRequestParam());
  // required override in case client didn't pass pagination params
  requestParam.paginationParam.ignoreServicePagination = false;
  requestParam.paginationParam.paginationRequired = true;

  Object.assign(requestParam, req.query);

  requestParam.loginUser = getLoginUser(context, requestParam.uuid);

  context.log.debug('mapEntityReqToRequestParam success with requestParam', requestParam);
  return requestParam;
};

export const mapAssignableTollfreeReqToRequestParam = (req: Request, res: Response) => {
  const context = res.locals.context;
  context.log.debug('mapAssignableTollfreeReqToRequestParam triggered');
  const requestParam: any = mapCommonGetReqToRequestParam(req, res, new AssignableTollfreeRequestParam());
  // required override in case client didn't pass pagination params
  requestParam.paginationParam.ignoreServicePagination = false;
  requestParam.paginationParam.paginationRequired = true;

  Object.assign(requestParam, req.query);

  requestParam.loginUser = getLoginUser(context, requestParam.uuid);

  context.log.debug('mapAssignableTollfreeReqToRequestParam success with requestParam', requestParam);
  return requestParam;
};
