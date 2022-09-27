import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class HaaUserRoleUnassignedEntity extends BaseEntity {
  assignableRoleId: string;
  name: string;
  description: string;
  cascading: string;

  static transformer = {
    mapping: {
      item: {
        assignableRoleId: 'ASSIGNABLE_ROLE_ID',
        name: 'NAME',
        description: 'DESCRIPTION',
        cascading: 'CASCADING',
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: HaaUserRoleUnassignedEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HaaUserRoleUnassignedEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HaaUserRoleUnassignedEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }
}
