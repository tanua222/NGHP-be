import ResponseDto from '../dto/response.dto';
import { HaaHierarchyNodeEntity } from './base.entity';
const transformer = require('json-transformer-node');

export default class HaaAssignedTollfreeEntity extends HaaHierarchyNodeEntity {
  tollfreeNumber: string;
  tollfreeVanityNumber: string;

  static transformer = {
    mapping: {
      item: {
        entityNodeId: 'ENTITY_NODE_ID',
        hierarchyNodeId: 'HN_ID',
        entitySequenceId: 'ENTITY_SEQ_ID',
        entityId: 'ENTITY_ID',
        tollfreeNumber: 'TOLLFREE_NUMBER',
        tollfreeVanityNumber: 'TOLLFREE_VANITY_NUMBER',
        entityEffectiveDate: 'EFFECTIVE_DATE',
        entityEndDate: 'END_DATE',
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
            item: HaaAssignedTollfreeEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HaaAssignedTollfreeEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HaaAssignedTollfreeEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }

  static getDbColumnName(columnName: string): any {
    const index = Object.keys(HaaAssignedTollfreeEntity.transformer.mapping.item).findIndex((n1) => n1 == columnName);
    return index > -1 ? Object.values(HaaAssignedTollfreeEntity.transformer.mapping.item)[index] : undefined;
  }
}
