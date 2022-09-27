import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class HierarchyTreeNodeEntity extends BaseEntity {
  id: string;
  hirId: string;
  corpId: string;
  ntpId: number;
  ndeId: string;
  effectiveDate: string;
  endDate: string | null;
  createDate: string;
  createName: string;
  lastUpdateName: string | null;
  lastUpdateDate: string | null;
  ndeName: string;
  parentHierarchyId: string;

  hasChild: number;
  isActive: number;
  nodeType: string;
  canMoveIndicator: string;

  static transformer = {
    mapping: {
      item: {
        id: 'ID',
        hirId: 'HIR_ID',
        corpId: 'CORP_ID',
        ntpId: 'NTP_ID',
        ndeId: 'NDE_ID',
        effectiveDate: 'EFFECTIVE_DATE',
        endDate: 'END_DATE',
        createDate: 'CREATE_DATE',
        createName: 'CREATE_NAME',
        lastUpdateName: 'LAST_UPDATE_NAME',
        lastUpdateDate: 'LAST_UPDATE_DATE',
        ndeName: 'NDE_NAME',
        parentHierarchyId: 'PARENT_HIERARCHY_ID',

        hasChild: 'HAS_CHILD',
        isActive: 'IS_ACTIVE',
        nodeType: 'NODE_TYPE',
        canMoveIndicator: 'CAN_MOVE_INDICATOR',
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: HierarchyTreeNodeEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HierarchyTreeNodeEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HierarchyTreeNodeEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }
}
