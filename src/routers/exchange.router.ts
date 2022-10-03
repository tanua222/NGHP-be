import express, { Request, Response } from 'express';
import HaaBaseDao from '../dao/haa-base.dao';
import { RequestParam } from '../domain/dto/haa-common.dto';
import ResponseDto from '../domain/dto/response.dto';
import {
  mapFeatureGetReqToRequestParam,
  mapExchangeGetReqToRequestParam
} from '../middleware/haa/haa-req-mapper';
import ExchangeService from '../services/exchange.service';
import HaaBaseGetService from '../services/haa-base-get.service';

const router: express.Router = express.Router();

// todo add normal js docs
/** 
  wget --no-check-certificate --quiet \
  --method GET \
  --timeout=0 \
  --header '' \
   'http://localhost:3006/ivsHierarchy/v1/exchange?offset=0&sort=abbrev&filter=14&limit=10'
**/
router.get('/', execute(ExchangeService, mapExchangeGetReqToRequestParam));

// todo: move to helper
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

export default router;
