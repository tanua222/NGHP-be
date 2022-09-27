import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class HierarchyUserPrivilegeEntity extends BaseEntity {
  hnId: string;
  cascading: string;

  static transformer = {
    mapping: {
      item: {
        hnId: 'HN_ID',
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
            item: HierarchyUserPrivilegeEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HierarchyUserPrivilegeEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HierarchyUserPrivilegeEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }
}
