import { NextFunction, Request, Response } from 'express';
import { isExternalUser, isNullOrUndefined, isEmpty } from '../../utils/util';
import ResponseDto from '../../domain/dto/response.dto';
import HaaAuthHelperService from '../../services/haa-auth-helper.service';
import { AppConfig } from '../../utils/app-config';
import Context from '../../utils/context';
import { isAuthorized } from './authorization-client';
import { AuthorizationMapping } from './authorization-mapping';
import {
  AuthorizationDefinition,
  Evaluate,
  Source,
  AuthorizationMappingDefinition,
  Action,
  MaskDetails,
  Condition,
} from './authorization-mapping-types';
import { AuthorizationMappingExternal } from './authorization-mapping-external';
const { match } = require('path-to-regexp');
const config = <AppConfig>require('config');

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
  const context: Context = res.locals.context;
  let log = context.log;
  const externalUser = isExternalUser(context);
  log.debug('authorization triggered');
  const authMapping = externalUser ? AuthorizationMappingExternal : AuthorizationMapping;

  let authDefinition = authMapping.find((element) => {
    if (element.method != req.method) return false;
    if (!element.pathMatcher) element.pathMatcher = match(`${config.server.contextPath}/` + element.path);
    return element!.pathMatcher!(req.path);
  });

  if (authDefinition) {
    let maskDetailss: MaskDetails[] = [];

    log.debug(`checking authorization for: ${req.method} ${req.path}`);
    try {
      let conditionalAuths = authDefinition.authorization.filter((authElement) => !authElement.disabled);
      let activeAuths: AuthorizationDefinition[] = [];
      for (const conditionalAuth of conditionalAuths) {
        let conditionResult = true;
        if (conditionalAuth.condition) {
          if (typeof conditionalAuth.condition === 'function') {
            conditionResult = conditionalAuth.condition(req);
          } else {
            conditionResult = await evaluateCondition(
              conditionalAuth.condition,
              authDefinition,
              context,
              conditionalAuth,
              req
            );
          }
        }
        if (conditionResult) activeAuths.push(conditionalAuth);
      }

      for (const authElement of activeAuths) {
        const authReq = {
          authorizationType: await evaluateValue(
            authDefinition,
            context,
            authElement,
            req,
            authElement.authorizationType
          ),
          privilegeName: await evaluateValue(authDefinition, context, authElement, req, authElement.privilegeName),
          hierarchyNodeId: await evaluateValue(authDefinition, context, authElement, req, authElement.hierarchyNodeId),
          entityType: authElement.entityType,
          entityId: await evaluateValue(authDefinition, context, authElement, req, authElement.entityId),
          corporationId: await evaluateValue(authDefinition, context, authElement, req, authElement.corporationId),
          // SSO change : inject authentication information for authorization API calls
          // TODO temporary until SSO is switched on , then everything would be based on context
          uuid: context.get('uuid') || req.query.uuid,
        };
        let authorized;
        if (authReq.uuid) {
          switch (authReq.authorizationType) {
            case 'forbidden':
              authorized = false;
              break;
            case 'allowed':
              authorized = true;
              log.info('authorization skipped');
              break;
            default:
              log.debug('isAuthorized call with: authReq= ', authReq, ' for req.path= ', req.path);
              authorized = await isAuthorized(authReq, context);
              break;
          }
        }
        if (!authorized) {
          if (!authElement.onFail || authElement.onFail === Action.forbid) {
            forbidAuthorization(context, res);
            return;
          } else if (typeof authElement.onFail === 'function') {
            let errorRes = authElement.onFail(context);
            res.status(errorRes.errorCode).send(errorRes);
            return;
          } else if (authElement.onFail === Action.maskResponse) {
            authElement.maskDetails && maskDetailss.push(authElement.maskDetails);
          } else if (authElement.onFail === Action.maskRequest) {
            let maskPath = authElement.maskDetails && authElement.maskDetails.path;
            if (maskPath) {
              let tokens = maskPath.split('.');
              let lastToken = tokens[tokens.length - 1];
              let intermediate = tokens.slice(0, tokens.length - 1).reduce((newval, token) => {
                if (!newval) return newval;
                return newval[token];
              }, req.body);
              if (intermediate && intermediate[lastToken]) delete intermediate[lastToken];
            }
          }
        }
      }
    } catch (error) {
      log.error(error);
      forbidAuthorization(context, res);
      return;
    }
    if (maskDetailss.length > 0) {
      let send = res.send;
      res.send = function (respObj: any) {
        if (typeof respObj == 'object') {
          maskDetailss.forEach((mask) => {
            if (mask.path) {
              let tokens = mask.path.split('.');
              let lastToken = tokens[tokens.length - 1];
              let intermediate = tokens.slice(0, tokens.length - 1).reduce((newval, token) => {
                if (!newval) return newval;
                return newval[token];
              }, respObj);
              if (intermediate && intermediate[lastToken]) delete intermediate[lastToken];
            }
          });
        }
        return send.call(this, respObj);
      };
    }
  }

  next();
};

const forbidAuthorization = async (context: Context, resp: Response): Promise<any> => {
  context.log.info('authorization forbidden');
  let errorRes = ResponseDto.accessForbidden(context);
  resp.status(errorRes.errorCode).send(errorRes);
};

const evaluateValue = async (
  authorizationMappingDef: AuthorizationMappingDefinition,
  context: Context,
  authorizationDef: AuthorizationDefinition,
  req: Request,
  evaluateOrString?: any
): Promise<any> => {
  if (!evaluateOrString) return;

  if (typeof evaluateOrString === 'string') {
    return evaluateOrString;
  }

  const evaluate: Evaluate = evaluateOrString;

  switch (evaluate.source) {
    case Source.path:
      let pathParam = getNotNullOrUndefinedOrEmptyValue(
        evaluate.param,
        "When Source is 'path' then param must not be undefined or empty"
      );
      if (authorizationMappingDef.pathMatcher) {
        return getNotNullOrUndefinedOrEmptyValue(
          authorizationMappingDef.pathMatcher(req.path).params[pathParam],
          "When Source is 'path' then value must not be undefined or empty"
        );
      }
      break;
    case Source.query:
      let queryParam = getNotNullOrUndefinedOrEmptyValue(
        evaluate.param,
        "When Source is 'query' then param must not be undefined or empty"
      );
      return getNotNullOrUndefinedOrEmptyValue(
        req.query[queryParam],
        "When Source is 'query' then value must not be undefined or empty"
      );
    case Source.value:
      return getNotNullOrUndefinedOrEmptyValue(
        evaluate.value,
        "When Source is 'value' then value must not be undefined or empty"
      );
    case Source.function:
      let fn = getNotNullOrUndefinedOrEmptyValue(
        evaluate.fn,
        "When Source is 'function' then fn must not be undefined or empty"
      );
      return getNotNullOrUndefinedOrEmptyValue(
        fn(req, authorizationMappingDef.pathMatcher && authorizationMappingDef.pathMatcher(req.path).params)
      );
    case Source.body:
      let bodyParam = getNotNullOrUndefinedOrEmptyValue(
        evaluate.param,
        "When Source is 'body' then param must not be undefined or empty"
      );
      let elements: string[] = bodyParam.split('.');
      if (elements[0] === 'list') {
        var tmp: any[] = [];
        for (const i of req.body) {
          tmp.push(elements.slice(1).reduce((newval, token) => newval[token], i));
        }
        return getNotNullOrUndefinedOrEmptyValue(
          Array.from(new Set(tmp)),
          "When Source is 'body' then value must not be undefined or empty"
        );
      } else {
        return getNotNullOrUndefinedOrEmptyValue(
          elements.reduce((newval, token) => newval[token], req.body),
          "When Source is 'body' then value must not be undefined or empty"
        );
      }
    case Source.helperService:
      let helperArguments = getNotNullOrUndefinedOrEmptyValue(
        evaluate.helperArguments,
        "When Source is 'helperService' then helperArguments must not be undefined or empty"
      );
      const service = new HaaAuthHelperService({ context });
      let serviceParam: any = { service: evaluate.service };
      for (const k of Object.keys(helperArguments)) {
        serviceParam[k] = await evaluateValue(
          authorizationMappingDef,
          context,
          authorizationDef,
          req,
          helperArguments ? helperArguments[k] : undefined
        );
      }
      context.log.debug('Helper service params are: ' + serviceParam);
      let helperServiceRes = await service.get(serviceParam);
      context.log.debug('Helper service result is: ' + helperServiceRes);
      return getNotNullOrUndefinedOrEmptyValue(
        helperServiceRes,
        "When Source is 'helperService' then result must not be undefined or empty"
      );
    default:
      throw `Unhandled source: ${evaluate.source}`;
  }
};

const getNotNullOrUndefinedOrEmptyValue = (value: any, errorMessage?: String): any => {
  if (!isNullOrUndefined(value)) {
    if (typeof value === 'string' && isEmpty(value)) {
      throw errorMessage;
    }
    return value;
  } else throw errorMessage;
};

const evaluateCondition = async (
  condition: Condition,
  authorizationMappingDef: AuthorizationMappingDefinition,
  context: Context,
  authorizationDef: AuthorizationDefinition,
  req: Request
): Promise<boolean> => {
  let paramVal = await evaluateValue(authorizationMappingDef, context, authorizationDef, req, condition.param);
  return condition.fn(paramVal);
};
