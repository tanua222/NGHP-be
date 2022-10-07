import { sortableString } from '../../utils/util';
import { BaseDto } from '../dto/haa-common.dto';
import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class ExchangePostEntity extends BaseEntity {
  abbrev: string;
  bookNum: string;
  createdUserId: string;
  secondAbbrev: string;
  exchangeFullName: string;
  lastUpdatedUserId: string;
  sectionNum: string;
  npa: NpaExchangePostEntity[];

  static transformer = {
    mapping: {
      item: {
        // bnemNpa: 'BNEM_NPA',
        // bnemNpaExchId: 'BNEM_NPA_EXCH_ID',
        abbrev: 'EXCH_ABBREV',
        bookNum: 'BOOK_NUM',
        createdUserId: 'CREATE_USER_ID',
        secondAbbrev: 'EXCH_ABBREV_2',
        exchangeFullName: 'EXCH_FULL_NAME',
        lastUpdatedUserId: 'LAST_UPDT_USER_ID',
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
            item: ExchangePostEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  // todo move to helper
  static transform(json: any): ExchangePostEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, ExchangePostEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }

  // todo move to helper
  static getDbColumnName(columnName: string): any {
    const index = Object.keys(ExchangePostEntity.transformer.mapping.item).findIndex((n1) => n1 == columnName);
    return index > -1 ? Object.values(ExchangePostEntity.transformer.mapping.item)[index] : undefined;
  }


}

export class NpaExchangePostEntity extends BaseEntity {
  bnemNpaExchId?: number;
  bnemNpa: string;
  // data from Exchange entity
  abbrev: string;
  createdUserId: string;
  exchangeFullName: string;
  lastUpdatedUserId: string;
}
