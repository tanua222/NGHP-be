import express, { Request, Response } from 'express';
import HaaBaseDao from '../dao/haa-base.dao';
import { RequestParam } from '../domain/dto/haa-common.dto';
import ResponseDto from '../domain/dto/response.dto';
import { mapFeaturePatchReqToRequestParam, MapRequestFunctions } from '../middleware/haa/haa-req-mapper';
import HaaUserRoleMgtUpdateService from '../services/features/users/haa-user-role-mgt-update.service';
import HaaBaseService from '../services/haa-base.service';

const routes: express.Router = express.Router();

/* add TASK routes */
routes.patch('/user/update', executePatchTask(HaaUserRoleMgtUpdateService));

function executePatchTask<T extends HaaBaseService<HaaBaseDao>>(
  ServiceClass: new (...args: any[]) => T,
  requestParamFn?: (req: Request, res: Response, mapReqFn: MapRequestFunctions) => RequestParam
): any {
  return async (req: Request, res: Response) => {
    const context = res.locals.context;
    const params = requestParamFn
      ? requestParamFn(req, res, new MapRequestFunctions())
      : mapFeaturePatchReqToRequestParam(req, res, new MapRequestFunctions());

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
