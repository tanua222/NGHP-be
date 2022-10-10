import { sortableString } from '../../utils/util';
import { BaseDto } from '../dto/haa-common.dto';
import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class ExchangePostEntity extends BaseEntity {
  abbreviation: string;
  bookNumber: string;
  createdUserId: string;
  secondAbbreviation: string;
  fullName: string;
  lastUpdatedUserId: string;
  sectionNumber: string;
  npa: NpaExchangePostEntity[];

  static transformer = {
    mapping: {
      item: {
        // npa: 'BNEM_NPA',
        // id: 'BNEM_NPA_EXCH_ID',
        abbreviation: 'EXCH_ABBREV',
        bookNumber: 'BOOK_NUM',
        createdUserId: 'CREATE_USER_ID',
        secondAbbreviation: 'EXCH_ABBREV_2',
        fullName: 'EXCH_FULL_NAME',
        lastUpdatedUserId: 'LAST_UPDT_USER_ID',
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
  id?: number;
  npa: string;
  // data from Exchange entity
  abbreviation: string;
  createdUserId: string;
  fullName: string;
  lastUpdatedUserId: string;
}
