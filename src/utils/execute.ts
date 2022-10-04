import express, { Request, Response } from 'express';
import HaaBaseDao from '../dao/haa-base.dao';
import { RequestParam } from '../domain/dto/haa-common.dto';
import ResponseDto from '../domain/dto/response.dto';
import {
    mapFeatureGetReqToRequestParam
} from '../middleware/haa/haa-req-mapper';
import HaaBaseGetService from '../services/haa-base-get.service';

export function executeGet<T extends HaaBaseGetService<HaaBaseDao>>(
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