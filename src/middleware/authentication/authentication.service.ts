import { Request, Response } from 'express';
import { AppConfig, IdentityProviderDomain, IdentityProviderDomainDetails } from '../../utils/app-config';
import Context from '../../utils/context';
import ResponseDto, { Error } from '../../domain/dto/response.dto';
import { decodeToken, verifyAccessToken } from './JWT';
import { Jwt } from 'jsonwebtoken';
import { isValueInRequest } from '../../utils/util';

const config = <AppConfig>require('config');

// const tokenMap = new Map();

/**
 * Main entry point for authentication related logic
 * This will check if the accesstoken is verified and TTL is fine
 * Also it will update context with uuid and authorization details
 * So that later it can be used by other places
 * @param req
 * @param res
 * @returns
 */
export async function authenticateApi(req: Request, res: Response): Promise<ResponseDto<any>> {
  const context: Context = res.locals.context;
  try {
    // To switch off SSO in local , remove it before prod
    if (!config.authentication.enabled) {
      context.log.debug('---- Authentication / SSO  not enabled ----- ');
      context.add({ uuid: String(req.query.uuid || '') }, true);
      return ResponseDto.authorized(context);
    }

    context.log.debug('authenticateApi authentication enabled ----- ');

    const accessToken = req.headers['authorization']?.replace('Bearer ', '') || '';

    if (!isValueInRequest(accessToken)) {
      throw Error.unAuthorizedMissingToken();
    }

    const decodedToken: Jwt = decodeToken(accessToken);

    const identityProviderDomain: IdentityProviderDomainDetails = getConfigIdentityProviderDomain(
      context,
      req,
      decodedToken
    );
    if (!identityProviderDomain.enabled) {
      throw Error.unAuthorizedDisabledIpd();
    }

    const tokenVerified = await verifyAccessToken(context, accessToken, 'accessToken', identityProviderDomain);
    if (tokenVerified) {
      return ResponseDto.authorized(context);
    }

    return ResponseDto.unauthorized(context);
  } catch (error) {
    context.log.debug('authentication middleware : access token is not valid with error', error);
    return ResponseDto.unauthorized(context, error);
  }
}

/**
 * Default implementation to decide whether it's team-member or customer access-token
 * @param req
 * @param application
 * @param decodedToken
 * @returns
 */
function getConfigIdentityProviderDomain(context: Context, req: Request, decodedToken: Jwt) {
  const idps: IdentityProviderDomain = config.authentication.identityProviderDomains;
  if (idps.teamMember && idps.teamMember.issuer === decodedToken.payload!.iss) {
    return idps.teamMember;
  }
  if (idps.customer && idps.customer.issuer === decodedToken.payload!.iss) {
    return idps.customer;
  }
  return idps.teamMember;
}
