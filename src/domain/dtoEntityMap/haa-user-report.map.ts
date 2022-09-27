import { UserReportDetailRequestParam } from '../dto/haa-common.dto';
import HaaUserReportDetailDto from '../dto/haa-user-report-detail.dto';
import HaaAssignedUserReportEntity from '../entities/haa-assigned-user-report.entity';

export class HaaUserReportMap {
  static dtoToEntityForUpdate(requestParam: UserReportDetailRequestParam): HaaAssignedUserReportEntity {
    const entity = new HaaAssignedUserReportEntity();
    const dto: HaaUserReportDetailDto = requestParam.inputRequest;
    dto.recipientUserId && (entity.recipientUserId = dto.recipientUserId);
    dto.format && (entity.formatCode = dto.format);
    dto.language && (entity.reportLanCode = dto.language);
    return entity;
  }
}
