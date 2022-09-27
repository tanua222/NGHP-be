import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class HaaUserAssignedDetailEntity extends BaseEntity {
  uId: string;
  hnId: string;
  lastName: string;
  firstName: string;
  login: string;
  roleId: string;
  roleCascading: string;
  roleName: string;
  roleDescription: string;

  static transformer = {
    mapping: {
      item: {
        lastName: 'U_LAST_NAME',
        firstName: 'U_FIRST_NAME',
        login: 'U_LOGIN_USER_NAME',
        roleId: 'R_ROLE_ID',
        roleCascading: 'R_CASCADING',
        roleDescription: 'DESCRIPTION',
        roleName: 'NAME',
        uId: 'U_ID',
        hnId: 'HN_ID',
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: HaaUserAssignedDetailEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HaaUserAssignedDetailEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HaaUserAssignedDetailEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }
}
