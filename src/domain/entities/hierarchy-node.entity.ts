import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
import { sortableString } from '../../utils/util';

const transformer = require('json-transformer-node');

export default class HierarchyNodeEntity extends BaseEntity {
  id: string;
  ndeId: string;
  ntpId: number;
  @sortableString() name: string;
  effectiveDate: string;
  endDate: string | null;
  @sortableString() description1: string | null;
  nodeType: string;
  billingTelephoneNumber: string;
  parentHierarchyId: string;
  @sortableString() parentHierarchyNodeName: string;
  parentHierarchyNodeLevel: number;
  parentHierarchyNodeType: string;
  corpId: string;
  canMoveIndicator: string;
  canViewIndicator: string;

  static transformer = {
    mapping: {
      item: {
        id: 'ID',
        ndeId: 'NDE_ID',
        ntpId: 'NTP_ID',
        name: 'NAME',
        effectiveDate: 'EFFECTIVE_DATE',
        endDate: 'END_DATE',
        description1: 'DESCRIPTION1',
        nodeType: 'NODE_TYPE',
        billingTelephoneNumber: 'BILLING_TELEPHONE_NUMBER',
        parentHierarchyId: 'PARENT_HIERARCHY_ID',
        parentHierarchyNodeName: 'PARENT_NODE_NAME',
        parentHierarchyNodeLevel: 'PARENT_NODE_LEVEL',
        parentHierarchyNodeType: 'PARENT_NODE_TYPE',
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
            item: HierarchyNodeEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HierarchyNodeEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HierarchyNodeEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }

  static getDbColumnName(columnName: string): any {
    const index = Object.keys(HierarchyNodeEntity.transformer.mapping.item).findIndex((n1) => n1 == columnName);
    return index > -1 ? Object.values(HierarchyNodeEntity.transformer.mapping.item)[index] : undefined;
  }
}
