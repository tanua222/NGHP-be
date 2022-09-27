import HaaUserReportDetailDto from '../dto/haa-user-report-detail.dto';
import HaaUserReportDetailEntity from '../entities/haa-user-report-detail.entity';

export class HaaUserReportDetailMap {
  static entityToDto(entities: HaaUserReportDetailEntity[]): HaaUserReportDetailDto[] {
    if (!entities?.length) return [];

    return entities.map((entity) => {
      let dto = new HaaUserReportDetailDto();
      dto.assignedReportId = entity.assignedReportId;
      dto.reportCode = entity.reportCode;
      dto.reportDescription = entity.reportDescription;
      dto.language = entity.reportLanCode;
      dto.recipientUserId = entity.recipientUserId;
      dto.recipientLoginName = entity.recipientLoginName;
      dto.format = entity.formatCode;

      return dto;
    });
  }
}
