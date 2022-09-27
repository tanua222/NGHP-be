import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
import { sortableString } from '../../utils/util';
const transformer = require('json-transformer-node');

export default class HaaIdCodeSetEntity extends BaseEntity {
  entityId: string;
  @sortableString() idCodeSetCode: string;
  @sortableString() idCodeSetDescription: string;
  @sortableString() idCodeSetType: string;
  idCodeSetLength: number;
  entityEffectiveDate: string;
  @sortableString() hierarchyNodeName: string;
  hierarchyNodeLevel: number;
  nodeType: string;

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
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: HaaIdCodeSetEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HaaIdCodeSetEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HaaIdCodeSetEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }

  static getDbColumnName(columnName: string): any {
    const index = Object.keys(HaaIdCodeSetEntity.transformer.mapping.item).findIndex((n1) => n1 == columnName);
    return index > -1 ? Object.values(HaaIdCodeSetEntity.transformer.mapping.item)[index] : undefined;
  }
}
