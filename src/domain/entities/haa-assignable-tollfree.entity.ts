import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class HaaAssignableTollfreeEntity extends BaseEntity {
  entitySequenceId: string;
  tollfreeNumber: string;
  tollfreeVanityNumber: string;

  static transformer = {
    mapping: {
      item: {
        entitySequenceId: 'ENTITY_SEQ_ID',
        tollfreeNumber: 'TF_NUMBER',
        tollfreeVanityNumber: 'TF_VANITY',
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: HaaAssignableTollfreeEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HaaAssignableTollfreeEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HaaAssignableTollfreeEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }

  static getDbColumnName(columnName: string): any {
    const index = Object.keys(HaaAssignableTollfreeEntity.transformer.mapping.item).findIndex((n1) => n1 == columnName);
    return index > -1 ? Object.values(HaaAssignableTollfreeEntity.transformer.mapping.item)[index] : undefined;
  }
}
