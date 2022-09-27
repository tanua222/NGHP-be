import express, { Request, Response } from 'express';
import HaaBaseDao from '../dao/haa-base.dao';
import { RequestParam } from '../domain/dto/haa-common.dto';
import ResponseDto from '../domain/dto/response.dto';
import {
  mapFeaturePostReqToRequestParam,
  MapRequestFunctions,
  mapTreePostReqToRequestParam,
  mapHaaExtractCreateReqToRequestParam
} from '../middleware/haa/haa-req-mapper';
import HaaUserReportAssignService from '../services/features/reports/haa-user-report-assign.service';
import HaaUserReportUnassignService from '../services/features/reports/haa-user-report-unassign.service';
import HaaUserRoleMgtAssignService from '../services/features/users/haa-user-role-mgt-assign.service';
import HaaUserRoleMgtUnassignService from '../services/features/users/haa-user-role-mgt-unassign.service';
import HaaBaseService from '../services/haa-base.service';
import HierarchyTreeService from '../services/hierarchy-tree.service';
import HaaUserReportReassignService from '../services/features/reports/haa-user-report-reassign.service';
import HaaEntityAssignService from '../services/features/entities/haa-entity-assign.service';
import HaaEntityUnassignService from '../services/features/entities/haa-entity-unassign.service';
import HierarchyWtnMoveService from '../services/features/wtn/hierarchy-wtn-move.service';
import HierarchyNodeMoveService from '../services/nodes/hierarchy-node-move.service';
import { mapEntityPostReqToRequestParam } from '../middleware/haa/haa-req-mapper';
import { ENTITY_TYPE } from '../utils/constants';
import HaaExtractCreateService from '../services/features/extracts/haa-extract-create.service';
import HaaExtractFileService from '../services/features/extracts/haa-extract-file.service';

const routes: express.Router = express.Router();

/* add TASK routes */
routes.post('/task', executePostTask(HaaBaseService));
routes.post('/userReport/assign', executePostTask(HaaUserReportAssignService));
routes.post('/userReport/unassign', executePostTask(HaaUserReportUnassignService));
routes.post('/userReport/reassign', executePostTask(HaaUserReportReassignService));
routes.post('/user/assign', executePostTask(HaaUserRoleMgtAssignService));
routes.post('/user/unassign', executePostTask(HaaUserRoleMgtUnassignService));
routes.post('/retrieveHierarchyTree', executePostTask(HierarchyTreeService, mapTreePostReqToRequestParam));
routes.post('/workingTelephoneNumber/move', executePostTask(HierarchyWtnMoveService));
routes.post('/hierarchyNode/move', executePostTask(HierarchyNodeMoveService));

//extract
routes.post('/hierarchyExtract',executePostTask(HaaExtractCreateService, mapHaaExtractCreateReqToRequestParam));
routes.post('/hierarchyExtract/:entityId', executePostTask(HaaExtractFileService));
//entities
routes.post(
  '/accountCodeSetEntity/assign',
  executePostTask(HaaEntityAssignService, mapEntityPostReqToRequestParam(ENTITY_TYPE.ACSET))
);
routes.post('/accountCodeSetEntity/unassign', executePostTask(HaaEntityUnassignService));
routes.post(
  '/tollFreeNumberEntity/assign',
  executePostTask(HaaEntityAssignService, mapEntityPostReqToRequestParam(ENTITY_TYPE.TFNUM))
);
routes.post('/tollFreeNumberEntity/unassign', executePostTask(HaaEntityUnassignService));
routes.post(
  '/idCodeSetEntity/assign',
  executePostTask(HaaEntityAssignService, mapEntityPostReqToRequestParam(ENTITY_TYPE.ICSET))
);
routes.post('/idCodeSetEntity/unassign', executePostTask(HaaEntityUnassignService));

function executePostTask<T extends HaaBaseService<HaaBaseDao>>(
  ServiceClass: new (...args: any[]) => T,
  requestParamFn?: (req: Request, res: Response, mapReqFn: MapRequestFunctions) => RequestParam
): any {
  return async (req: Request, res: Response) => {
    const context = res.locals.context;
    const params = requestParamFn
      ? requestParamFn(req, res, new MapRequestFunctions())
      : mapFeaturePostReqToRequestParam(req, res, new MapRequestFunctions());

    try {
      const service = new ServiceClass(context);
      const featureDto = await service.executeTask({ params });
      ResponseDto.sendResponse(featureDto, res);
    } catch (error) {
      ResponseDto.sendResponse(ResponseDto.catchResponse(context, error), res);
    }
  };
}

export default routes;
