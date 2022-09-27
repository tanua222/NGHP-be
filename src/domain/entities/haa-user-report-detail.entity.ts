import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class HaaUserReportDetailEntity extends BaseEntity {
  assignedReportId: string;
  reportCode: string;
  reportLanCode: string;
  reportDescription: string;
  recipientUserId: string;
  recipientLoginName: string;
  formatCode: string;

  static transformer = {
    mapping: {
      item: {
        recipientUserId: 'USER_ID',
        assignedReportId: 'REPORT_ID',
        reportCode: 'CODE',
        reportLanCode: 'LAN_CODE',
        reportDescription: 'NAME',
        recipientLoginName: 'LOGIN_USER_NAME',
        formatCode: 'FMT_CODE',
      },
    },
  };

  static transformerArray = {
    mapping: {
      item: {
        result: [
          {
            list: 'data',
            item: HaaUserReportDetailEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HaaUserReportDetailEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HaaUserReportDetailEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }
}
