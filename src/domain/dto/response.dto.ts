import { Response } from 'express';
import * as _ from 'lodash';
import { errorResponse } from '../../error/error-responses';
import { ErrorMapping } from '../../error/error-responses-mapping';
import { StatusCode } from '../../utils/constants';
import Context from '../../utils/context';
import { isBuffer, isEmpty, isNull, isNumeric } from '../../utils/util';
import { BadRequestError, UnAuthorizedError } from '../entities/error.entity';

export default class ResponseDto<T = void> {
  code?: number;
  errors: Error[];
  result?: T;
  errorCode?: any;
  resultCount?: number = 0;
  totalCount?: number = 0;
  pageCount?: number = 0;

  successIndicator: boolean;
  numberOfPages: number;
  summaries: any;

  constructor() {
    this.errorCode = StatusCode.SUCCESS.code;
    this.code = StatusCode.SUCCESS.code;
  }

  static returnValidationErrors(errors: Error[]) {
    if (errors.length) {
      const response = ResponseDto.badRequestError();
      response.errors = errors;
      throw response;
    }
  }

  static partialResponse() {
    let response = new ResponseDto();
    response.reponseCode(StatusCode.PAGINATION_SUCCESS);
    return response;
  }

  static badRequestError(message?: string) {
    let response = new ResponseDto();
    response.reponseCode(StatusCode.ERR_BAD_REQUEST);
    response.successIndicator = false;
    response.errors = [];
    if (message) {
      response.errors.push(Error.badRequestError(message));
    }
    return response;
  }

  static badRequestErrorCode(context: Context, code: any, param?: any) {
    let response = new ResponseDto();
    response.reponseCode(StatusCode.ERR_BAD_REQUEST);
    response.errors = [];
    response.successIndicator = false;
    response.errors.push(errorResponse(code, context, param));
    return response;
  }

  static internalErrorCode(context: Context, code: any, param?: any) {
    let response = new ResponseDto<null>();
    response.reponseCode(StatusCode.ERR_INTERNAL_SERVER);
    response.errors = [];
    response.successIndicator = false;
    response.errors.push(errorResponse(code, context, param));
    return response;
  }

  static internalError(message?: string) {
    let response = new ResponseDto();
    response.reponseCode(StatusCode.ERR_INTERNAL_SERVER);
    response.successIndicator = false;
    response.errors = [Error.internalError(message)];
    return response;
  }

  static notFoundError(context: Context, params?: any, code?: any): ResponseDto<null> {
    let response = new ResponseDto<null>();
    response.reponseCode(StatusCode.ERR_NOT_FOUND);
    response.successIndicator = false;
    response.errors = [errorResponse(code || ErrorMapping.IVSHAA4404, context, params)];
    return response;
  }

  /**
   * unauthorized user 401 , access forbidden to use it 403
   * https://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses
   */
  static unauthorized(context: Context, errors?: any): ResponseDto<null> {
    let response = new ResponseDto<null>();
    response.reponseCode(StatusCode.UNAUTHORIZED);
    response.successIndicator = false;
    response.errors = [errorResponse(ErrorMapping.IVSHAAAUTH4401, context, errors)];
    return response;
  }

  /**
   * unauthorized user 401 , access forbidden to use it 403
   * https://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses
   */
  static authorized(context?: Context): ResponseDto<null> {
    let response = new ResponseDto<null>();
    response.reponseCode(StatusCode.SUCCESS);
    response.successIndicator = true;
    return response;
  }

  static extractUserIdError(context: Context, errors?: any): ResponseDto<null> {
    let response = new ResponseDto<null>();
    response.reponseCode(StatusCode.ERR_ACCESS_FORBIDDEN);
    response.successIndicator = false;
    response.errors = [errorResponse(ErrorMapping.IVSHAA44031, context, errors)];
    return response;
  }

  static extractUserIdSuccess(context?: Context): ResponseDto<null> {
    let response = new ResponseDto<null>();
    response.reponseCode(StatusCode.SUCCESS);
    response.successIndicator = true;
    return response;
  }

  static accessForbidden(context: Context): ResponseDto<null> {
    let response = new ResponseDto<null>();
    response.reponseCode(StatusCode.ERR_ACCESS_FORBIDDEN);
    response.successIndicator = false;
    response.errors = [errorResponse(ErrorMapping.IVSHAA4403, context)];
    return response;
  }

  static catchResponse(context: Context, e: any) {
    context.log.error(e);
    if (e instanceof ResponseDto) {
      return e;
    } else if (e instanceof BadRequestError) {
      return ResponseDto.badRequestErrorCode(context, e.code);
    } else if (e instanceof UnAuthorizedError) {
      return ResponseDto.unauthorized(context);
    } else {
      return ResponseDto.internalError(e.message);
    }
  }

  reponseCode(responseCode: any) {
    this.errorCode = responseCode.code;
    this.code = responseCode.code;
  }

  static createSuccessResponse<T>() {
    let response = new ResponseDto<T>();
    response.reponseCode(StatusCode.CREATED);
    return response;
  }

  static sendResponse = (resDto: ResponseDto<any>, res: Response) => {
    const successErrroCodes = [
      StatusCode.SUCCESS.code,
      StatusCode.CREATED.code,
      StatusCode.NO_CONTENT.code,
      StatusCode.PAGINATION_SUCCESS.code,
    ];

    if (!successErrroCodes.includes(resDto.errorCode)) {
      res
        .status(resDto.errorCode)
        .set({
          'X-Result-Count': resDto.resultCount,
          'X-Total-Count': resDto.totalCount,
          'X-Page-Count': resDto.pageCount,
        })
        .send(resDto.errors);
    } else if (isBuffer(resDto.result)) {
      const data = resDto.result;
      res.setHeader('Content-Length', data.length);
      res.write(data, 'binary');
      res.end();
    } else {
      res
        .status(resDto.code || StatusCode.SUCCESS.code)
        .set({
          'X-Result-Count': resDto.resultCount,
          'X-Total-Count': resDto.totalCount,
          'X-Page-Count': resDto.pageCount,
        })
        .send(resDto.result);
    }
  };
}

export class Error {
  error?: string;
  reason: string;
  message?: string;
  traceId?: string;
  params?: any;

  constructor(error: string, reason: string, message: string) {
    this.error = error;
    this.reason = reason;
    this.message = message;
  }

  static noDbConnection(poolAlias: string, sql: string) {
    return new Error(
      'NO_DB_CONNECTION',
      `No dbconnection for poolAlias: '${poolAlias}'`,
      `No dbconnection for poolAlias: '${poolAlias}' in sql: '${sql}'`
    );
  }

  static invalidParameter(param: string, validParameters: any[]) {
    return new Error(
      'INVALID_PARAMETER',
      `Invalid parameter '${param}'`,
      `Valid parameters are: [${validParameters.reduce((a, b) => `${a}, ${b}`)}]`
    );
  }

  static invalidParameterValue(param: any, validParameters: any[]) {
    return new Error(
      'INVALID_PARAMETER_VALUE',
      `Invalid parameter value '${param}'`,
      `Valid values are: [${validParameters.reduce((a, b) => `${a}, ${b}`)}]`
    );
  }

  static invalidGetCorpOrdersListParameter(param: string, message: string) {
    return new Error('INVALID_PARAMETER', `Invalid parameter '${param}'`, `Valid parameters are: [` + message + `]`);
  }

  static badParameter(queryParam: any, param: string, message: string) {
    return new Error('BAD_PARAMETER', `Bad parameter '${param}=${queryParam[param]}'`, message);
  }

  static badRequestError(message?: string) {
    return new Error('BAD_REQUEST', `Bad request error`, message || 'Notify application support team');
  }

  static internalError(message?: string) {
    return new Error('INTERNAL_SERVER', `Internal server error`, message || 'Notify application support team');
  }

  static notFoundError(message: string) {
    return new Error('NO_RESULTS_FOUND', `No result found`, message);
  }

  static badParameterNotOnList(param: string, value: any, validValues: any[]) {
    return new Error(
      'BAD_PARAMETER',
      `Bad parameter '${param}=${value}'`,
      `Valid values are: [${validValues.reduce((a, b) => `${a}, ${b}`)}]`
    );
  }

  static missingParameter(param: string) {
    return new Error('BAD_PARAMETER', `Missing parameter '${param}'`, `Parameter '${param}' is required.`);
  }

  static unAuthorizedForThisScope(param: string) {
    return new Error(
      'UNAUTHORIZED',
      'Invalid Scope',
      `Provided scope '${param}' in access token is not valid for currnet scope of LD Order`
    );
  }

  static unAuthorizedTokenInvalid(error: any) {
    return new Error(
      'UNAUTHORIZED',
      'Token invalid',
      `Provided token could not be veified with error '${error}'. Please try to login`
    );
  }

  static unAuthorizedTokenKeyError(error: any) {
    return new Error(
      'UNAUTHORIZED',
      'Token key error',
      `Provided token could not be veified with error '${error}'. Please try to login`
    );
  }

  static unAuthorizedTokenTimedOut(param: string) {
    return new Error('UNAUTHORIZED', 'Token Timed Out', `Provided token timed out. Please try to login`);
  }

  static unAuthorizedApi(param: string) {
    return new Error(
      'UNAUTHORIZED',
      'UnAuthorized Token',
      `Provided token can not be authenticated. Please try to login`
    );
  }

  static unAuthorizedMissingToken(param?: string) {
    return new Error('UNAUTHORIZED', 'Token missing', `Missing token , can not be authenticated. Please try to login `);
  }

  static unAuthorizedDisabledIpd(param?: string) {
    return new Error(
      'UNAUTHORIZED',
      'Config issue authentication identity provider domain',
      'Identity provider domain in config is disabled , please enable relevant one'
    );
  }

  static addErrorIfInvalid(code: any, errors: Error[], context: any, params: any, validate: Function) {
    if (params.fields?.length) {
      _.each(params.fields, (field) => {
        validate(field) && errors.push(errorResponse(code, context, params));
      });
    } else {
      if (validate()) {
        errors.push(errorResponse(code, context, params));
      }
    }
  }

  static checkRequired(code: any, value: any, errors: Error[], context: any) {
    let len = value?.toString()?.length || 0;
    if (len == 0) {
      errors.push(errorResponse(code, context));
    }
  }

  static checkInArray(code: any, value: any, values: any, errors: Error[], context: any) {
    if (value?.toString()?.trim()) {
      if (!values.includes(value)) {
        errors.push(
          errorResponse(code, context, {
            validValues: values,
          })
        );
      }
    }
  }

  static checkInValidValues(code: any, value: any, values: any, errors: Error[], context: any) {
    value && !values.includes(value) && errors.push(errorResponse(code, context, { validValues: values }));
  }

  static checkInValidTime(code: any, startTime: number, endTime: number, errors: Error[], context: any) {
    if (startTime > endTime) {
      errors.push(errorResponse(code, context));
    }
  }

  static addErrorWithCode(code: any, errors: Error[], context?: any, params?: any) {
    errors.push(errorResponse(code, context, params));
  }

  static checkMinLength(code: any, value: any, minLen: number, errors: Error[], context: any) {
    if (null != value && value.length <= minLen) {
      errors.push(
        errorResponse(code, context, {
          minLength: minLen,
        })
      );
    }
  }

  static checkIsNumber(code: any, value: any, errors: Error[], context: any) {
    if (value != null && !isNumeric(value)) {
      // errors.push(new Error('BAD_PARAMETER', `Non-numeric value '${value}'`, `Parameter '${param}' must be a number.`));
      errors.push(errorResponse(code, context));
    }
  }

  // Because of this , using string.match
  //   var reg = /abc/g;
  // !!'abcdefghi'.match(reg); // => true
  // !!'abcdefghi'.match(reg); // => true
  // reg.test('abcdefghi');    // => true
  // reg.test('abcdefghi');    // => false <=
  static checkPattern(code: any, value: string, pattern: any, errors: Error[], context: any) {
    if (!isNull(value) && !value.match(pattern)) {
      errors.push(errorResponse(code, context));
    }
  }

  static checkSortParameterNotOnList(
    code: any,
    sortValues: any,
    validValues: any[],
    errors: Error[],
    context: Context
  ) {
    // valu can be 'column1' or 'column1,-column2'
    if (sortValues != null) {
      _.each(sortValues.split(','), (v: string) => {
        if (v.startsWith('-')) {
          v = v.substring(1);
        }
        if (!validValues.includes(v)) {
          errors.push(
            errorResponse(code, context, {
              invalid: v,
              valid: validValues.reduce((a, b) => `${a}, ${b}`),
            })
          );
          // errors.push(new Error('BAD_PARAMETER', `Bad sort value '${v}'`, `Valid values are: [${validValues.reduce((a, b) => `${a}, ${b}`)}]`));
        }
      });
    }
  }

  static checkAllMustExist(code: any, queryParams: any, params: any[], errors: Error[], context: any) {
    if (params.length && !_.every(params.map((p) => queryParams[p]))) {
      errors.push(
        errorResponse(code, context, {
          queryParams: params,
        })
      );
    }
  }

  static checkCannotCoExist(code: any, queryParams: any, params: any[], errors: Error[], context: any) {
    if (params.length && _.every(params.map((p) => queryParams[p]))) {
      errors.push(
        errorResponse(code, context, {
          queryParams: params,
        })
      );
    }
  }

  static checkOneMustExist(code: any, map: any, fields: any[], errors: Error[], context: Context) {
    const present = fields.length ? fields.map((p) => map[p]) : [];
    if (present.length && present.length < 1) {
      errors.push(
        errorResponse(code, context, {
          queryParams: fields,
        })
      );
    }
  }

  static checkEmptyParam(code: any, map: any, param: string, errors: Error[], context: any) {
    if (map && param && map[param] && map[param].trim() === '') {
      errors.push(errorResponse(code, context));
    }
  }

  static checkInValidNumericValue(code: any, startVal: number, endVal: number, errors: Error[], context: any) {
    if (startVal > endVal) {
      errors.push(errorResponse(code, context));
    }
  }

  static checkMaxLength(params: {
    map: any;
    fields: { name: string; paramValue: any }[];
    errors: Error[];
    context: Context;
  }) {
    Error.checkFields(
      Object.assign(params, {
        code: ErrorMapping.IVSHAA4407,
        paramKey: 'maxLength',
        validate: (fieldValue: any, paramValue: any) =>
          isNumeric(fieldValue.length) && isNumeric(paramValue) && Number(fieldValue.length) > Number(paramValue),
      })
    );
  }

  static checkEqualLength(params: {
    map: any;
    fields: { name: string; paramValue: any }[];
    errors: Error[];
    context: Context;
  }) {
    Error.checkFields(
      Object.assign(params, {
        code: ErrorMapping.IVSHAA4408,
        paramKey: 'length',
        validate: (fieldValue: any, paramValue: any) =>
          isNumeric(fieldValue.length) && isNumeric(paramValue) && Number(fieldValue.length) !== Number(paramValue),
      })
    );
  }

  static checkEqualValues(params: {
    map: any;
    fields: { name: string; paramValue: any }[];
    errors: Error[];
    context: Context;
  }) {
    Error.checkFields(
      Object.assign(params, {
        code: ErrorMapping.IVSHAA4409,
        paramKey: 'value',
        validate: (fieldValue: any, paramValue: any) =>
          isNumeric(fieldValue) && isNumeric(paramValue) && Number(fieldValue) !== Number(paramValue),
      })
    );
  }

  static checkMaxValue(params: {
    map: any;
    fields: { name: string; paramValue: any }[];
    errors: Error[];
    context: Context;
  }) {
    Error.checkFields(
      Object.assign(params, {
        code: ErrorMapping.IVSHAA4410,
        paramKey: 'maxValue',
        validate: (fieldValue: any, paramValue: any) =>
          isNumeric(fieldValue) && isNumeric(paramValue) && Number(fieldValue) > Number(paramValue),
      })
    );
  }

  static checkDuplicateValues(code: any, value: any, values: any, errors: Error[], context: any) {
    value && values.includes(value) && errors.push(errorResponse(code, context, { fieldValue: value }));
  }

  static checkRequiredFields(params: { map: any; fields: any[]; errors: Error[]; context: Context }) {
    Error.checkFields(
      Object.assign(params, {
        code: ErrorMapping.IVSHAA4405,
        validate: (map: any, field: string) => isEmpty(map[field]),
      })
    );
  }

  static checkNumericFields(params: { map: any; fields: any[]; errors: Error[]; context: Context }) {
    Error.checkFields(
      Object.assign(params, {
        code: ErrorMapping.IVSHAA4406,
        validate: (map: any, field: string) => map[field] && !isNumeric(map[field]),
      })
    );
  }

  static checkEmptyFields(params: { map: any; fields: any[]; errors: Error[]; context: Context }) {
    Error.checkFields(
      Object.assign(params, {
        code: ErrorMapping.IVSHAA4411,
        validate: (map: any, field: string) => map[field] && isEmpty(map[field]), //String(map[field]).trim() === ''
      })
    );
  }

  static checkFieldsInRange(params: {
    map: any;
    fields: { name: string; paramValue: any }[];
    errors: Error[];
    context: Context;
  }) {
    Error.checkFields(
      Object.assign(params, {
        code: ErrorMapping.IVSHAA4412,
        paramKey: 'maxLength',
        validate: (fieldValue: any, paramValue: any) => {
          try {
            return (
              parseInt(fieldValue) < parseInt(paramValue['min']) || parseInt(fieldValue) > parseInt(paramValue['max'])
            );
          } catch (error) {
            return false;
          }
        },
      })
    );
  }

  static checkFieldValuesInSet(params: {
    map: any;
    fields: { name: string; paramValue: any }[];
    errors: Error[];
    context: Context;
  }) {
    Error.checkFields(
      Object.assign(params, {
        code: ErrorMapping.IVSHAA4413,
        validate: (fieldValue: any, paramValue: any) => {
          try {
            return !paramValue.map(String).includes(String(fieldValue));
          } catch (error) {
            return false;
          }
        },
      })
    );
  }

  static checkFieldsEqualLength(params: {
    map: any;
    fields: { name: string; paramValue: any }[];
    errors: Error[];
    context: Context;
  }) {
    Error.checkFields(
      Object.assign(params, {
        code: ErrorMapping.IVSHAA4414,
        validate: (fieldValue: any, paramValue: any) => {
          return (
            fieldValue !== undefined &&
            paramValue[`${paramValue.comparedToField}Length`] !== undefined &&
            fieldValue?.length !== paramValue[`${paramValue.comparedToField}Length`]
          );
        },
      })
    );
  }

  static checkFields(params: {
    code: any;
    map: any;
    fields: (string | { name: string; paramValue: any })[];
    paramKey?: string;
    errors: Error[];
    context: Context;
    validate: Function;
  }) {
    if (params.map && params.fields?.length) {
      const errFields = [];
      for (let index = 0; index < params.fields.length; index++) {
        const field = params.fields[index];

        if (typeof field === 'string') {
          if (params.validate(params.map, field)) {
            errFields.push({ name: field });
          }
        } else {
          if (!isEmpty(params.map[field.name]) && params.validate(params.map[field.name], field.paramValue)) {
            const err = { ...field };
            if (params.paramKey) {
              const param: any = {};
              param[params.paramKey] = field.paramValue;
              errFields.push({ name: field.name, paramValue: param });
            } else {
              errFields.push(err);
            }
          }
        }
      }
      if (errFields.length) {
        params.errors.push(errorResponse(params.code, params.context, { fields: errFields }));
      }
    }
  }
}
