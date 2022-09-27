import { BaseDto } from './haa-common.dto';

export default class HaaAssignableUserReportDto extends BaseDto {
  reportId: string;
  reportCode: string;
  reportDescription: string;
}
