import ResponseDto from '../dto/response.dto';
import { HaaHierarchyNodeEntity } from './base.entity';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

//assginable and assgined share the same entity
export class HaaAccountCodeSetEntity extends HaaHierarchyNodeEntity {
  accountCodeSetCode: string;
  accountCodeSetDescription: string;
  accountCodeSetLength: number;

  static transformer = {
    mapping: {
      item: {
        entityNodeId: 'ENTITY_NODE_ID',
        hierarchyNodeId: 'HN_ID',
        entitySequenceId: 'ENTITY_SEQ_ID',
        entityId: 'ENTITY_ID',
        accountCodeSetCode: 'ACCOUNTCODESET_CODE',
        accountCodeSetDescription: 'ACCOUNTCODESET_DESC',
        accountCodeSetLength: 'ACCOUNTCODESET_LENGTH',
        entityEffectiveDate: 'EFFECTIVE_DATE',
        hierarchyNodeName: 'NODENAME',
        hierarchyNodeLevel: 'NODELEVEL',
        nodeType: 'NODETYPE',
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
            item: HaaAccountCodeSetEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HaaAccountCodeSetEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HaaAccountCodeSetEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }

  static getDbColumnName(columnName: string): any {
    const index = Object.keys(HaaAccountCodeSetEntity.transformer.mapping.item).findIndex((n1) => n1 == columnName);
    return index > -1 ? Object.values(HaaAccountCodeSetEntity.transformer.mapping.item)[index] : undefined;
  }
}

export class HaaAssignAccountCodeSetEntity extends BaseEntity {
  entitySequenceId: string;
  parentHierarchyNodeId: number;
}
