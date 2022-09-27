import HaaAssignableUserReportDao from '../../../dao/features/reports/haa-assignable-user-report.dao';
import { HaaAssignableUserReportMap } from '../../../domain/dtoEntityMap/haa-assignable-user-report.map';
import HaaAssignableUserReportEntity from '../../../domain/entities/haa-assignable-user-report.entity';
import Context from '../../../utils/context';
import HaaBaseGetService from '../../haa-base-get.service';

export default class HaaAssignableUserReportService extends HaaBaseGetService<HaaAssignableUserReportDao> {
  constructor(context: Context) {
    super({ context, dao: new HaaAssignableUserReportDao({ context }) });
  }

  isArray(): boolean {
    return true;
  }

  mapEntityToDto(ivsEntity: HaaAssignableUserReportEntity[]) {
    // TODO: cache result once a day
    return HaaAssignableUserReportMap.entityToDto(ivsEntity);
  }
}
