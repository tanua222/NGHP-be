import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

// fixme
export default class ExchangeEntity extends BaseEntity {
  bnemNpa: string;
  bnemNpaExchId: string;
  bookNum: string;
  createTs: string;
  createUserId: string;
  exchAbbrev2: string;
  exchAbbrev: string;
  exchFullName: string;
  lastUpdtTs: string;
  lastUpdtUserId: string;
  resultCount: string;
  sectionNum: string;
  // TODO: Do we need to define types?

  static transformer = {
    mapping: {
      item: {
        bnemNpa: 'BNEM_NPA',
        bnemNpaExchId: 'BNEM_NPA_EXCH_ID',
        bookNum: 'BOOK_NUM',
        createTs: 'CREATE_TS',
        createUserId: 'CREATE_USER_ID',
        exchAbbrev2: 'EXCH_ABBREV_2',
        exchAbbrev: 'EXCH_ABBREV',
        exchFullName: 'EXCH_FULL_NAME',
        lastUpdtTs: 'LAST_UPDT_TS',
        lastUpdtUserId: 'LAST_UPDT_USER_ID',
        resultCount: 'RESULT_COUNT',
        sectionNum: 'SECTION_NUM'
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: ExchangeEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  // todo move to helper
  static transform(json: any): ExchangeEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, ExchangeEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }

  // todo move to helper
  static getDbColumnName(columnName: string): any {
    const index = Object.keys(ExchangeEntity.transformer.mapping.item).findIndex((n1) => n1 == columnName);
    return index > -1 ? Object.values(ExchangeEntity.transformer.mapping.item)[index] : undefined;
  }
}
