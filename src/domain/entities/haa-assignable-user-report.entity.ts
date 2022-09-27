import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class HaaAssignableUserReportEntity extends BaseEntity {
  reportId: string;
  reportCode: string;
  reportDescription: string;

  static transformer = {
    mapping: {
      item: {
        reportId: 'ID',
        reportCode: 'CODE',
        reportDescription: 'DESCRIPTION',
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: HaaAssignableUserReportEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HaaAssignableUserReportEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HaaAssignableUserReportEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }
}
