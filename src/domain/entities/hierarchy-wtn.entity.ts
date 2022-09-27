import { sortableString } from '../../utils/util';
import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class HierarchyWtnEntity extends BaseEntity {
  id: string;
  nodeId: string;
  wtn: string;
  wtnType: string;
  @sortableString() name: string;
  @sortableString() description1: string;
  description2: string;
  description3: string;
  excludeFromReportsFlag: string;
  btn: string;
  ntpId: number;
  parentHierarchyId: string;
  @sortableString() parentNodeName: string;
  parentNtpId: number;
  parentNodeType: string;
  effectiveDate: string;
  hirId: string;
  corpId: string;
  canMoveIndicator: string;
  canViewIndicator: string;

  static transformer = {
    mapping: {
      item: {
        id: 'ID',
        nodeId: 'NDE_ID',
        wtn: 'WTN',
        wtnType: 'WTN_TYPE',
        name: 'NAME',
        description1: 'DESCRIPTION1',
        description2: 'DESCRIPTION2',
        description3: 'DESCRIPTION3',
        excludeFromReportsFlag: 'EXCLUDE_FROM_REPORTS_FLAG',
        btn: 'BTN',
        ntpId: 'NTP_ID',
        parentHierarchyId: 'PARENT_HIERARCHY_ID',
        parentNodeName: 'PARENT_NODE_NAME',
        parentNtpId: 'PARENT_NTP_ID',
        parentNodeType: 'PARENT_NODE_TYPE',
        effectiveDate: 'EFFECTIVE_DATE',
        hirId: 'HIR_ID',
        corpId: 'CORP_ID',
        canMoveIndicator: 'CAN_MOVE_INDICATOR',
        canViewIndicator: 'CAN_VIEW_INDICATOR',
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: HierarchyWtnEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HierarchyWtnEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HierarchyWtnEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }

  static getDbColumnName(columnName: string): any {
    const index = Object.keys(HierarchyWtnEntity.transformer.mapping.item).findIndex((n1) => n1 == columnName);
    return index > -1 ? Object.values(HierarchyWtnEntity.transformer.mapping.item)[index] : undefined;
  }
}
