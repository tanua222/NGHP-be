export const PRIMARY = 'Primary';
export const PREPLAN = 'Preplan';
export const UTC = 'UTC';
export const LOCALE_DATE_PATTERN = /(\d{1,2})\/(\d{1,2})\/(\d{1,4}), (.{8})/;
export const dateFormat_YMD = 'YYYYMMDD';
export const USER_AUTH_PATH = '/user/authorization';
export const FIND_USER_PATH = '/user';

export const BASE_CORP_NODE_LEVEL = 4;
export const MAXIMUM_ALLOWABLE_NODE_LEVEL = 8;

export const sortableStringMetadataKey = Symbol('sortableString');
export const sortableObjectMetadataKey = Symbol('sortableObject');

export const RAW_REPORTS = ['20200', '20202'];
export enum Language {
  EN = 'E',
  FR = 'F',
}

export enum YesNo {
  Y = 'Y',
  N = 'N',
}

export const StatusCode = {
  SUCCESS: {
    code: 200,
    description: 'OK',
  },
  CREATED: {
    code: 201,
    description: 'Created',
  },
  NO_CONTENT: {
    code: 204,
    description: 'No Content',
  },
  PAGINATION_SUCCESS: {
    code: 206,
    description: 'Partial Content',
  },
  ERR_BAD_REQUEST: {
    code: 400,
    description: 'Bad Request',
  },
  UNAUTHORIZED: {
    code: 401,
    description: 'Unauthorized',
  },
  ERR_NOT_FOUND: {
    code: 404,
    description: 'Not Found',
  },
  ERR_ACCESS_FORBIDDEN: {
    code: 403,
    description: 'Access Forbidden',
  },
  ERR_METHOD_NOT_ALLOWED: {
    code: 405,
    description: 'Method Not Allowed',
  },
  ERR_CONFLICT: {
    code: 409,
    description: 'Conflict',
  },
  ERR_INTERNAL_SERVER: {
    code: 500,
    description: 'Internal Server Error',
  },
};

export const COMMA_SEPARATOR = ',';
export const GUI_SORT_DESC_OPERATOR = '-';
export const BLANK_STRING = '';

export interface DateTimeConfig {
  dbTimeZoneName: string;
}

export const MAX_PERCENTAGE_TOTAL = 100;

export const HIERARCHY_TREE_DEFAULT_VALUES = {
  ROOT_NTP_ID: 4,
  NTP_TO_LEVEL_DIFFERENCE: 3,
};
export const X_SESSION_TRACEID = 'x-session-traceid';
export const X_REQUEST_TRACEID = 'x-request-traceid';

export const NODE_TYPES = {
  ROOT: 'ROOT',
  DEFAULT_NODE: 'DWTN',
  NODE: 'NODE',
  WTN: 'WTN',
};

export enum ENTITY_TYPE {
  ACSET = 'ACSET',
  TFNUM = 'TFNUM',
  ICSET = 'ICSET',
}

export enum UserType {
  LDORS = 'LDORS',
  REBILLER = 'REBILLER',
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  UNDEFINED = 'UNDEFINED',
}
