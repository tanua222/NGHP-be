import moment from 'moment'; //JL
import { Language, sortableObjectMetadataKey, sortableStringMetadataKey } from './constants';
import Context from './context';

const regex_metacharacters = ['\\', '^', '$', '.', '|', '?', '*', '+', '(', ')', '[', '{'];

export const translate = (str: string, str1: string, str2: string) => {
  if (!str || !str1 || !str2 || str1.length != str2.length) {
    return str;
  }
  for (let i = 0; i < str1.length; i++) {
    let e1 = str1.charAt(i);

    if (regex_metacharacters.includes(e1)) {
      e1 = `\\${e1}`;
    }

    let e2 = str2.charAt(i);
    // console.log(str, e1, e2)
    var regx = new RegExp(e1, 'g');
    str = str.replace(regx, e2);
  }
  return str;
};

const numericPattern = /^\d+$/;

export const isNumeric = (str: string) => {
  return numericPattern.test(str);
};

export const isEmpty = (str: string | number | null | undefined) => {
  return isNullOrUndefined(str) || 0 === str!.toString().trim().length;
};

export const isNotEmpty = (str: string | null | undefined) => {
  return !isEmpty(str);
};

export const isNull = (str: string) => {
  return str === null || str === undefined || str.length <= 0;
};

export const isNullOrUndefined = (value: any) => {
  return value === null || value === undefined;
};

export const NVL = (value: any, defaultValue: any) => {
  return isNullOrUndefined(value) ? defaultValue : value;
};

export const isDefined = (value: any) => {
  return value !== undefined;
};

/* JL Checks if input parameter is a valid date in YYYYMMDD format */
export const isDate = (str: string) => {
  return moment(str, 'YYYYMMDD', true).isValid();
};

export const currentDate = () => {
  const dateFormat = require('dateformat');
  return dateFormat(new Date(), 'yyyymmdd');
};

export const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);

export const handleRequestedStartDate = (serviceOrderDto: any) => {
  serviceOrderDto.requestedStartDate &&
    isDueDateBeforeCurrentDate(serviceOrderDto.requestedStartDate) &&
    delete serviceOrderDto.requestedStartDate;
};

export const isDueDateBeforeCurrentDate = (requestedDate: string) => {
  if (new Date(requestedDate).getTime() <= new Date().getTime()) {
    return true;
  }
  return false;
};

/**
 * Need to get the user based on context and not from login user
 * @param context
 * @param loginUser
 */
export const getLoginUser = (context: Context, uuid = 'SYSTEM') => {
  if (Boolean(process.env.OVERRIDE_UUID) === true) {
    return uuid;
  }
  return context.uuid || uuid;
};

export const isDataUpdated = (result: any, expectedRowsAffected = 1) => {
  return result && result.rowsAffected === expectedRowsAffected;
};

/*
 * Returns Daylight Saving Time offset in minutes
 */
export const getDstOffset = (dt = new Date()) => {
  const stdTimezoneOffset = (dt: Date) => {
    var jan = new Date(dt.getFullYear(), 0, 1);
    var jul = new Date(dt.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  };
  return dt.getTimezoneOffset() - stdTimezoneOffset(dt);
};

export function isFuture(date: Date): boolean {
  return date > new Date();
}

export const isValueInRequest = (value: any) => {
  return value !== 'null' && value !== 'undefined' && value !== '' && value !== null && value !== undefined;
};

export const isBuffer = (value: any) => {
  return value instanceof Uint8Array;
};

export function sortableObject(subfields: string[]) {
  return Reflect.metadata(sortableObjectMetadataKey, subfields);
}

export function sortableString() {
  return Reflect.metadata(sortableStringMetadataKey, true);
}

export function getSortByColumn(target: any, propertyKey: string, columnName: string) {
  let sortable = false;
  let checkSubfields = propertyKey.includes('.');
  if (checkSubfields) {
    // sample entity: @sortableObject(['networkCode']) network: { networkId: string; networkCode: string; }
    const parentKey = propertyKey.substring(0, propertyKey.indexOf('.'));
    const subfieldKey = propertyKey.substring(propertyKey.indexOf('.') + 1);
    // extract "network" from "network.networkCode", use to get subfields
    const subfields = Reflect.getMetadata(sortableObjectMetadataKey, target, parentKey);
    // console.log(`subfields[${parentKey}]`, subfields);
    // check if subfields has "networkCode"
    sortable = subfields.includes(subfieldKey);
  } else {
    sortable = Reflect.getMetadata(sortableStringMetadataKey, target, propertyKey) || false;
  }

  if (sortable) {
    return `LOWER(${columnName})`;
  }
  return columnName;
}

export const isExternalUser = (context: Context): boolean => {
  return 'true' === context?.get('externalUser');
};

export const isValidParamString = (string: string): boolean => {
  const sqlInjectPreventionRegex = "]'";
  const stringFound = string.includes(sqlInjectPreventionRegex);
  if (stringFound) {
    return false;
  }
  return true;
};

const validEnglishLanguage = ['en','en-CA','en-CA,en;q=0.5','E']
export const getLanguageCode = (language: string): Language => {
  if (validEnglishLanguage.includes(language)){
    return Language.EN
  }else{
    return Language.FR
  }
};