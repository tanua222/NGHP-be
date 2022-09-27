import { NextFunction, Request, Response } from 'express';
import ResponseDto from '../../domain/dto/response.dto';
import Context from '../../utils/context';
import { decodeToken } from '../authentication/JWT';
import { Jwt } from 'jsonwebtoken';
import { isEmpty, isExternalUser } from '../../utils/util';
import { findUserByParam } from '../authorization/authorization-client';
import { AppConfig, IdentityProviderDomain } from '../../utils/app-config';
import { UserType } from '../../utils/constants';
const config = <AppConfig>require('config');

export const userInformationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const context: Context = res.locals.context;
  context.log.debug('userInformationMiddleware middleware triggered');

  const exportUserIdResponse: ResponseDto<any> = await exportUserId(req, res);
  context.log.debug('userInformationMiddleware exportUserId done with response: ', exportUserIdResponse);
  if (exportUserIdResponse.successIndicator === true) {
    next();
  } else {
    return res.status(exportUserIdResponse.errorCode).send(exportUserIdResponse.errors);
  }
};

export const exportUserId = async (req: Request, res: Response): Promise<ResponseDto<any>> => {
  const context: Context = res.locals.context;
  context.add({ authorization: req.headers['authorization']! }, false);
  context.log.debug('exportUserId middleware function');

  try {
    const userToken = String(req.headers['usertoken'] || '')?.replace('Bearer ', '');
    const accessToken = req.headers['authorization']?.replace('Bearer ', '') || '';
    let decodedToken: Jwt;
    if (!isEmpty(userToken)) {
      context.add({ usertoken: String(req.headers['usertoken']!) }, false);
      context.log.debug('exportUserId decoded token from user token');
      decodedToken = decodeToken(userToken);
    } else {
      context.log.debug('exportUserId decoded token from authorization token');
      decodedToken = decodeToken(accessToken);
    }
    setUserType(context, decodedToken);

    const externalUserFlow = isExternalUser(context);
    if (decodedToken?.payload?.sub) {
      const dbUsers: any = await getUserInformationBasedOnUserFlow(
        context,
        externalUserFlow,
        String(decodedToken?.payload?.sub)
      );
      if (dbUsers?.length > 0) {
        context.add({ userInformation: dbUsers[0] }, false);
        context.add({ userId: dbUsers[0].userId }, false);
        context.add({ uuid: dbUsers[0].uniqueId }, true);
        req.query.uuid = String(dbUsers[0].uniqueId);
        return ResponseDto.extractUserIdSuccess(context);
      } else {
        const queryParam = externalUserFlow ? 'unique id' : 'login name';
        const value = decodedToken?.payload?.sub;
        context.log.error('exportUserId user not found based on ', queryParam, ' and value: ', value);
        return ResponseDto.extractUserIdError(context);
      }
    } else {
      context.log.error('exportUserId user information missing in decoded token');
      return ResponseDto.extractUserIdError(context);
    }
  } catch (error) {
    context.log.error('exportUserId error : ', error);
    return ResponseDto.extractUserIdError(context, error);
  }
};

export const getUserInformationBasedOnUserFlow = async (
  context: Context,
  externalUserFlow: boolean,
  tokenSub: string
) => {
  if (externalUserFlow) {
    return await findUserByParam({ uniqueId: tokenSub }, context);
  } else {
    return await findUserByParam({ loginUserName: tokenSub }, context);
  }
};

export const setUserType = (context: Context, decodedToken: Jwt) => {
  const idps: IdentityProviderDomain = config.authentication.identityProviderDomains;
  let userType: UserType = UserType.UNDEFINED;
  if (idps.teamMember && idps.teamMember.issuer === decodedToken.payload!.iss) {
    context.add({ externalUser: 'false' }, false);
    userType = UserType.INTERNAL;
  }
  if (idps.customer && idps.customer.issuer === decodedToken.payload!.iss) {
    context.add({ externalUser: 'true' }, true);
    userType = UserType.EXTERNAL;
  }
  if (decodedToken.payload!.client_id === config.callingApplication.get('ldors')?.clientId) {
    userType = UserType.LDORS;
  }
  if (decodedToken.payload!.client_id === config.callingApplication.get('rebiller')?.clientId) {
    userType = UserType.REBILLER;
  }
  if (userType === UserType.UNDEFINED) {
    context.log.error("User Type can't be defined");
    throw (
      "User Type can't be defined for sub= " +
      decodedToken.payload?.sub +
      ' or clientId= ' +
      decodedToken.payload?.client_id
    );
  } else {
    context.log.debug('User Type ' + userType + ' added to context');
    context.add({ userType: userType }, true);
  }
};
