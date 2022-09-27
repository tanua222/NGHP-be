import express, { Request, Response } from 'express';
import HaaBaseDao from '../dao/haa-base.dao';
import { RequestParam } from '../domain/dto/haa-common.dto';
import ResponseDto from '../domain/dto/response.dto';
import {
  mapPaginatingListReqToRequestParam,
  mapEntityReqToRequestParam,
  mapAssignedUserReportReqToRequestParam,
  mapFeatureGetReqToRequestParam,
  mapNodeGetReqToRequestParam,
  mapAssignableTollfreeReqToRequestParam,
  mapUserReportDetailReqToRequestParam,
} from '../middleware/haa/haa-req-mapper';
import HaaAssignedAccountCodeSetService from '../services/features/entities/accountcodeset/haa-assigned-account-code-set.service';
import HaaAssignableAccountCodeSetService from '../services/features/entities/accountcodeset/haa-assignable-account-code-set.service';
import HaaAssignedIdCodeSetService from '../services/features/entities/idcodeset/haa-assigned-id-code-set.service';
import HaaUserListAssignedService from '../services/features/users/haa-user-list-assigned.service';
import HaaAssignedTollfreeService from '../services/features/entities/tollfree/haa-assigned-tollfree.service';
import HaaBaseGetService from '../services/haa-base-get.service';
import HierarchyNodeListService from '../services/nodes/hierarchy-node-list.service';
import HaaUserAssignedDetailService from '../services/features/users/haa-user-assigned-detail.service';
import HaaUserListUnassignedService from '../services/features/users/haa-user-list-unassigned.service';
import HierarchyNodeGetService from '../services/nodes/hierarchy-node-get.service';
import HaaUserRoleListUnassignedService from '../services/features/users/haa-user-role-list-unassigned.service';
import HaaAssignedUserReportService from '../services/features/reports/haa-assigned-user-report.service';
import HierarchyWtnGetService from '../services/features/wtn/hierarchy-wtn-get.service';
import HierarchyWtnListGetService from '../services/features/wtn/hierarchy-wtn-list.service';
import HaaAssignableTollfreeService from '../services/features/entities/tollfree/haa-assignable-tollfree.service';
import HaaAssignableUserReportService from '../services/features/reports/haa-assignable-user-report.service';
import HaaUserReportDetailService from '../services/features/reports/haa-user-report-detail.service';
import HaaExtractListService from '../services/features/extracts/haa-extract-list.service';
import HaaAssignableIdCodeSetService from '../services/features/entities/idcodeset/haa-assignable-id-code-set.service';

const routes: express.Router = express.Router();

/* add GET routes */
routes.get('/user', execute(HaaUserListAssignedService, mapPaginatingListReqToRequestParam));
routes.get('/user/assignable', execute(HaaUserListUnassignedService));
routes.get('/user/assignableRole', execute(HaaUserRoleListUnassignedService));
routes.get('/user/detail', execute(HaaUserAssignedDetailService));
routes.get('/hierarchyExtract', execute(HaaExtractListService, mapPaginatingListReqToRequestParam));
routes.get('/hierarchyNode', execute(HierarchyNodeListService, mapNodeGetReqToRequestParam));
routes.get('/hierarchyNode/:nodeId', execute(HierarchyNodeGetService, mapNodeGetReqToRequestParam));
routes.get('/accountCodeSetEntity', execute(HaaAssignedAccountCodeSetService, mapEntityReqToRequestParam));
routes.get('/accountCodeSetEntity/assignable', execute(HaaAssignableAccountCodeSetService, mapEntityReqToRequestParam));
routes.get('/idCodeSetEntity', execute(HaaAssignedIdCodeSetService, mapEntityReqToRequestParam));
routes.get('/idCodeSetEntity/assignable', execute(HaaAssignableIdCodeSetService, mapEntityReqToRequestParam));
routes.get('/tollFreeNumberEntity', execute(HaaAssignedTollfreeService, mapEntityReqToRequestParam));
routes.get(
  '/tollFreeNumberEntity/assignable',
  execute(HaaAssignableTollfreeService, mapAssignableTollfreeReqToRequestParam)
);
routes.get('/userReport', execute(HaaAssignedUserReportService, mapAssignedUserReportReqToRequestParam));
routes.get('/userReport/assignable', execute(HaaAssignableUserReportService));
routes.get('/userReport/:assignedReportId', execute(HaaUserReportDetailService, mapUserReportDetailReqToRequestParam));
routes.get('/workingTelephoneNumber/:nodeId', execute(HierarchyWtnGetService, mapNodeGetReqToRequestParam));
routes.get('/workingTelephoneNumber', execute(HierarchyWtnListGetService, mapNodeGetReqToRequestParam));

function execute<T extends HaaBaseGetService<HaaBaseDao>>(
  ServiceClass: new (...args: any[]) => T,
  requestParamFn?: (req: Request, res: Response) => RequestParam
): any {
  return async (req: Request, res: Response) => {
    const context = res.locals.context;
    const params = (requestParamFn && requestParamFn(req, res)) || mapFeatureGetReqToRequestParam(req, res);

    try {
      const service = new ServiceClass(context);
      const featureDto = await service.retrieveHaaEntity(params);
      ResponseDto.sendResponse(featureDto, res);
    } catch (error) {
      ResponseDto.sendResponse(ResponseDto.catchResponse(context, error), res);
    }
  };
}

export default routes;
