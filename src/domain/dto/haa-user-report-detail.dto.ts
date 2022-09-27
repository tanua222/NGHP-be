import { BaseDto } from './haa-common.dto';

export default class HaaUserReportDetailDto extends BaseDto {
  assignedReportId: string;
  reportCode: string;
  language: string;
  reportDescription: string;
  recipientUserId: string;
  recipientLoginName: string;
  format: string;
}
