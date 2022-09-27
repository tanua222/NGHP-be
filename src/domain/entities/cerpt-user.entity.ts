import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class CerptUserEntity extends BaseEntity {
  id: string;
  loginUserName: string;

  static transformer = {
    mapping: {
      item: {
        id: 'ID',
        loginUserName: 'LOGIN_USER_NAME',
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: CerptUserEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any) {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, CerptUserEntity.transformerArray).result;
    }
    return transformer.transform(json, CerptUserEntity.transformer);
  }
}
