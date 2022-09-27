import HaaAssignableUserReportDto from '../dto/haa-assignable-user-report.dto';
import HaaAssignableUserReportEntity from '../entities/haa-assignable-user-report.entity';

export class HaaAssignableUserReportMap {
  static entityToDto(entities: HaaAssignableUserReportEntity[]): HaaAssignableUserReportDto[] {
    if (!entities?.length) return [];

    return entities.map((entity) => {
      let dto = new HaaAssignableUserReportDto();
      dto.reportId = entity.reportId;
      dto.reportCode = entity.reportCode;
      dto.reportDescription = entity.reportDescription;

      return dto;
    });
  }
}
