import ResponseDto from '../../dto/response.dto';
import BaseEntity from '../base.entity';
const transformer = require('json-transformer-node');

export default class ExchangeUpdateEntity extends BaseEntity {
  abbreviation: string;
  bookNumber: string;
  createdUserId: string;
  secondAbbreviation: string;
  fullName: string;
  lastUpdatedUserId: string;
  sectionNumber: string;
  npa: NpaExchangeUpdateEntity[];

  static transformer = {
    mapping: {
      item: {
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
            item: ExchangeUpdateEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  // todo move to helper
  static transform(json: any): ExchangeUpdateEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, ExchangeUpdateEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }

  // todo move to helper
  static getDbColumnName(columnName: string): any {
    const index = Object.keys(ExchangeUpdateEntity.transformer.mapping.item).findIndex((n1) => n1 == columnName);
    return index > -1 ? Object.values(ExchangeUpdateEntity.transformer.mapping.item)[index] : undefined;
  }
}

export class NpaExchangeUpdateEntity extends BaseEntity {
  id: number;
  npa: string;
  // data from Exchange entity
  // fixme
  // abbreviation: string;
  // createdUserId: string;
  // fullName: string;
  // lastUpdatedUserId: string;
}
