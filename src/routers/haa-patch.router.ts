import express, { Request, Response } from 'express';
import HaaBaseDao from '../dao/haa-base.dao';
import { RequestParam } from '../domain/dto/haa-common.dto';
import ResponseDto from '../domain/dto/response.dto';
import {
  mapFeaturePatchReqToRequestParam,
  mapNodeReqToRequestParam,
  MapRequestFunctions,
  mapUpdateUserReportReqToRequestParam,
} from '../middleware/haa/haa-req-mapper';
import HaaUserReportPatchService from '../services/features/reports/haa-user-report-patch.service';
import HaaWtnPatchService from '../services/features/wtn/hierarchy-wtn-patch.service';
import HaaBasePatchService from '../services/haa-base-patch.service';
import HierarchyNodePatchService from '../services/nodes/hierarchy-node-patch.service';

const routes: express.Router = express.Router();

/* add PATCH routes */
routes.patch('/hierarchyNode/:nodeId', execute(HierarchyNodePatchService, mapNodeReqToRequestParam));
routes.patch('/userReport/:assignedReportId', execute(HaaUserReportPatchService, mapUpdateUserReportReqToRequestParam));
routes.patch('/workingTelephoneNumber/:nodeId', execute(HaaWtnPatchService, mapNodeReqToRequestParam));

function execute<T extends HaaBasePatchService<HaaBaseDao>>(
  ServiceClass: new (...args: any[]) => T,
  requestParamFn?: (req: Request, res: Response, mapReqFn: MapRequestFunctions) => RequestParam
): any {
  return async (req: Request, res: Response) => {
    const context = res.locals.context;
    const params =
      (requestParamFn && requestParamFn(req, res, new MapRequestFunctions())) ||
      mapFeaturePatchReqToRequestParam(req, res, new MapRequestFunctions());

    try {
      const service = new ServiceClass(context);
      const featureDto = await service.updateHaaEntity(params);
      ResponseDto.sendResponse(featureDto, res);
    } catch (error) {
      ResponseDto.sendResponse(ResponseDto.catchResponse(context, error), res);
    }
  };
}

export default routes;
