import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class HaaUserUnassignedEntity extends BaseEntity {
  uId: string;
  uLastName: string;
  uFirstName: string;
  uLoginName: string;

  static transformer = {
    mapping: {
      item: {
        uId: 'U_ID',
        uLastName: 'U_LAST_NAME',
        uFirstName: 'U_FIRST_NAME',
        uLoginName: 'U_LOGIN_NAME',
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: HaaUserUnassignedEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HaaUserUnassignedEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HaaUserUnassignedEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }
}
