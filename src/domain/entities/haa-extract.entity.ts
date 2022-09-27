import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class HaaExtractEntity extends BaseEntity {
  totalPages: number;
  totalRows: number;
  extractId: number;
  userId: string;
  conId: number;
  hierarchyNodeId: string;
  languageCode: string;
  status: string;
  extractFileName: string;
  updateDate: string;
  nodeName: string;
  message: string;
  extractFile: any;

  static transformer = {
    mapping: {
      item: {
        totalPages: 'TOTAL_PAGES',
        totalRows: 'TOTAL_ROWS',
        extractId: 'EXTRACT_ID',
        userId: 'USER_ID',
        conId: 'CON_ID',
        hierarchyNodeId: 'HIERARCHY_NODE_ID',
        languageCode: 'LANGUAGE_CODE',
        nodeName: 'NDE_NAME',
        updateDate: 'UPDATED_ON',
        status: 'STATUS',
        extractFileName: 'EXTRACT_FILE_NAME',
        message: 'MESSAGE',
        extractFile: 'EXTRACT_FILE',
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: HaaExtractEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HaaExtractEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HaaExtractEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }

  static getDbColumnName(columnName: string): any {
    const index = Object.keys(HaaExtractEntity.transformer.mapping.item).findIndex((n1) => n1 == columnName);
    return index > -1 ? Object.values(HaaExtractEntity.transformer.mapping.item)[index] : undefined;
  }
}
