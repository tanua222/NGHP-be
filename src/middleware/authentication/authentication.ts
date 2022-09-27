import { NextFunction, Request, Response } from 'express';
import ResponseDto from '../../domain/dto/response.dto';
import Context from '../../utils/context';
import { authenticateApi } from './authentication.service';

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
  const context: Context = res.locals.context;
  context.log.debug('authentication triggered');

  const authenticated: ResponseDto<any> = await authenticateApi(req, res);
  context.log.debug('authentication authenticateApi done with response: ', authenticated);
  if (authenticated.successIndicator === true) {
    next();
  } else {
    return res.status(authenticated.errorCode).send(authenticated.errors);
  }
};
