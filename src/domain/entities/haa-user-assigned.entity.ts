import { sortableString } from '../../utils/util';
import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class HaaUserAssignedEntity extends BaseEntity {
  totalPages: number;
  totalRows: number;
  userId: string;
  @sortableString() userEmail: string;
  @sortableString() userLastName: string;
  @sortableString() userFirstName: string;
  @sortableString() userLoginName: string;
  nodeLevel: number;
  nodeId: string;
  @sortableString() nodeName: string;
  nodeType: string;
  canUnassignIndicator: string;

  static transformer = {
    mapping: {
      item: {
        totalPages: 'TOTAL_PAGES',
        totalRows: 'TOTAL_ROWS',
        userId: 'USER_ID',
        userLastName: 'USER_LAST_NAME',
        userFirstName: 'USER_FIRST_NAME',
        userLoginName: 'USER_LOGIN_NAME',
        userEmail: 'USER_EMAIL',
        nodeLevel: 'NODE_LEVEL',
        nodeId: 'NODE_ID',
        nodeName: 'NODE_NAME',
        nodeType: 'NODE_TYPE',
        canUnassignIndicator: 'CAN_UNASSIGN_INDICATOR',
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: HaaUserAssignedEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HaaUserAssignedEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HaaUserAssignedEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }

  static getDbColumnName(columnName: string): any {
    const index = Object.keys(HaaUserAssignedEntity.transformer.mapping.item).findIndex((n1) => n1 == columnName);
    return index > -1 ? Object.values(HaaUserAssignedEntity.transformer.mapping.item)[index] : undefined;
  }
}
