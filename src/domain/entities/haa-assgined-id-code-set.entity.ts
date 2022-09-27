import ResponseDto from '../dto/response.dto';
import { HaaHierarchyNodeEntity } from './base.entity';
const transformer = require('json-transformer-node');

export default class HaaAssignedIdCodeSetEntity extends HaaHierarchyNodeEntity {
  idCodeSetCode: string;
  idCodeSetDescription: string;
  idCodeSetType: string;
  idCodeSetLength: number;

  static transformer = {
    mapping: {
      item: {
        entityNodeId: 'ENTITY_NODE_ID',
        hierarchyNodeId: 'HN_ID',
        entitySequenceId: 'ENTITY_SEQ_ID',
        entityId: 'ENTITY_ID',
        idCodeSetCode: 'IDCODESET_CODE',
        idCodeSetDescription: 'IDCODESET_DESCRIPTION',
        idCodeSetType: 'IDCODESET_TYPE',
        idCodeSetLength: 'IDCODESET_LENGTH',
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
            item: HaaAssignedIdCodeSetEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HaaAssignedIdCodeSetEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HaaAssignedIdCodeSetEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }

  static getDbColumnName(columnName: string): any {
    const index = Object.keys(HaaAssignedIdCodeSetEntity.transformer.mapping.item).findIndex((n1) => n1 == columnName);
    return index > -1 ? Object.values(HaaAssignedIdCodeSetEntity.transformer.mapping.item)[index] : undefined;
  }
}
