import express, { Request, Response } from 'express';
import HaaBaseDao from '../dao/haa-base.dao';
import ResponseDto from '../domain/dto/response.dto';
import { mapFeaturePostReqToRequestParam, MapRequestFunctions } from '../middleware/haa/haa-req-mapper';
import HaaBasePostService from '../services/haa-base-post.service';
import HierarchyNodePostService from '../services/nodes/hierarchy-node-post.service';
import HierarchyWtnPostService from '../services/features/wtn/hierarchy-wtn-post.service';

const routes: express.Router = express.Router();

/* add POST routes */
routes.post('/hierarchyNode', execute(HierarchyNodePostService));
routes.post('/workingTelephoneNumber/add', execute(HierarchyWtnPostService));

function execute<T extends HaaBasePostService<HaaBaseDao>>(ServiceClass: new (...args: any[]) => T): any {
  return async (req: Request, res: Response) => {
    const context = res.locals.context;
    const params = mapFeaturePostReqToRequestParam(req, res, new MapRequestFunctions());

    try {
      const service = new ServiceClass(context);
      const dto = await service.createHaaEntity(params);
      ResponseDto.sendResponse(dto, res);
    } catch (error) {
      ResponseDto.sendResponse(ResponseDto.catchResponse(context, error), res);
    }
  };
}

export default routes;
