import ResponseDto from '../dto/response.dto';
import BaseEntity from './base.entity';
const transformer = require('json-transformer-node');

export default class HaaAssignedUserReportEntity extends BaseEntity {
  hierarchyNodeId: string;
  hierarchyNodeName: string;
  hierarchyNodeLevel: number;
  nodeType: string;
  assignedReportId: string;
  reportId: number;
  reportCode: string;
  reportLanCode: string;
  reportDescription: string;
  recipientLoginName: string;
  formatCode: string;
  recipientUserId: string;
  reportingPeriod: string;
  canUnassignIndicator: string;

  static transformer = {
    mapping: {
      item: {
        hierarchyNodeId: 'NODE_ID',
        hierarchyNodeName: 'NDE_NAME',
        hierarchyNodeLevel: 'NTP_ID',
        nodeType: 'NODE_TYPE',
        assignedReportId: 'ASSIGNED_REPORT_ID',
        reportCode: 'CODE',
        reportLanCode: 'LAN_CODE',
        reportDescription: 'NAME',
        recipientLoginName: 'LOGIN_USER_NAME',
        formatCode: 'FMT_CODE',
        recipientUserId: 'USR_ID',
        reportId: 'RPT_ID',
        reportingPeriod: 'REPORTING_PERIOD',
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
            item: HaaAssignedUserReportEntity.transformer.mapping.item,
          },
        ],
      },
    },
  };

  static transform(json: any): HaaAssignedUserReportEntity[] {
    if (Array.isArray(json)) {
      return transformer.transform({ data: json }, HaaAssignedUserReportEntity.transformerArray).result;
    }
    throw ResponseDto.internalError('Array is expected');
  }

  static getDbColumnName(columnName: string): any {
    const index = Object.keys(HaaAssignedUserReportEntity.transformer.mapping.item).findIndex((n1) => n1 == columnName);
    return index > -1 ? Object.values(HaaAssignedUserReportEntity.transformer.mapping.item)[index] : undefined;
  }
}
