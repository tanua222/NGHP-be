import express, { Request, Response } from 'express';
import HaaBaseDao from '../dao/haa-base.dao';
import { RequestParam } from '../domain/dto/haa-common.dto';
import ResponseDto from '../domain/dto/response.dto';
import {
  mapFeatureDeleteReqToRequestParam,
  mapNodeReqToRequestParam,
  MapRequestFunctions,
} from '../middleware/haa/haa-req-mapper';
import HaaExtractDeleteService from '../services/features/extracts/haa-extract-delete.service';
import HierarchyWtnRemoveService from '../services/features/wtn/hierarchy-wtn-remove.service';
import HaaBaseDeleteService from '../services/haa-base-delete.service';
import HierarchyNodeRemoveService from '../services/nodes/hierarchy-node-remove.service';

const routes: express.Router = express.Router();

/* add DELETE routes */
routes.delete('/hierarchyNode/:nodeId', execute(HierarchyNodeRemoveService, mapNodeReqToRequestParam));
routes.delete('/workingTelephoneNumber/:nodeId', execute(HierarchyWtnRemoveService, mapNodeReqToRequestParam));
routes.delete('/hierarchyExtract/:entityId', execute(HaaExtractDeleteService));

function execute<T extends HaaBaseDeleteService<HaaBaseDao>>(
  ServiceClass: new (...args: any[]) => T,
  requestParamFn?: (req: Request, res: Response, mapReqFn: MapRequestFunctions) => RequestParam
): any {
  return async (req: Request, res: Response) => {
    const context = res.locals.context;
    const params =
      (requestParamFn && requestParamFn(req, res, new MapRequestFunctions())) ||
      mapFeatureDeleteReqToRequestParam(req, res, new MapRequestFunctions());

    try {
      const service = new ServiceClass(context);
      const featureDto = await service.deleteHaaEntity(params);
      ResponseDto.sendResponse(featureDto, res);
    } catch (error) {
      ResponseDto.sendResponse(ResponseDto.catchResponse(context, error), res);
    }
  };
}

export default routes;
