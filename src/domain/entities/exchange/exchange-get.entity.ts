import { sortableString } from '../../../utils/util';
import ResponseDto from '../../dto/response.dto';
import BaseEntity from './../base.entity';
const transformer = require('json-transformer-node');

export default class ExchangeGetEntity extends BaseEntity {
  rn: number;
  npa: string;
  id: number;
  @sortableString() bookNumber: string;
  createTs: string;
  createUserId: string;
  @sortableString() exchAbbrev2: string;
  @sortableString() exchAbbrev: string;
  @sortableString() exchFullName: string;
  lastUpdtTs: string;
  @sortableString() lastUpdtUserId: string;
  resultCount: number;
  @sortableString() sectionNumber: string;

  static transformer = {
    mapping: {
      item: {
        rn: 'RN',
        npa: 'BNEM_NPA',
        id: 'BNEM_NPA_EXCH_ID',
        bookNumber: 'BOOK_NUM',
        createTs: 'CREATE_TS',
        createUserId: 'CREATE_USER_ID',
        exchAbbrev2: 'EXCH_ABBREV_2',
        exchAbbrev: 'EXCH_ABBREV',
        exchFullName: 'EXCH_FULL_NAME',
        lastUpdtTs: 'LAST_UPDT_TS',
        lastUpdtUserId: 'LAST_UPDT_USER_ID',
        resultCount: 'RESULT_COUNT',
        sectionNumber: 'SECTION_NUM'
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: ExchangeGetEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  // todo move to helper
  static transform(json: any): ExchangeGetEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, ExchangeGetEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }

  // todo move to helper
  static getDbColumnName(columnName: string): any {
    const index = Object.keys(ExchangeGetEntity.transformer.mapping.item).findIndex((n1) => n1 == columnName);
    return index > -1 ? Object.values(ExchangeGetEntity.transformer.mapping.item)[index] : undefined;
  }
}

export class NpaExchangeGetEntity extends BaseEntity {
  id: number;
  npa: string;
  // data from Exchange entity
  abbreviation: string;
  createdTs?: string;
  createdUserId: string;
  fullName: string;
  lastUpdatedTs?: string;
  lastUpdatedUserId: string;

  static transformer = {
    mapping: {
      item: {
        id: 'NPA_EXCH_ID',
        npa: 'NPA',
        abbreviation: 'EXCH_ABBREV',
        createdTs: 'CREATE_TS',
        createdUserId: 'CREATE_USER_ID',
        lastUpdatedTs: 'LAST_UPDT_TS',
        lastUpdtUserId: 'LAST_UPDT_USER_ID',
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: NpaExchangeGetEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  // todo move to helper
  static transform(json: any): NpaExchangeGetEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, NpaExchangeGetEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }
}
