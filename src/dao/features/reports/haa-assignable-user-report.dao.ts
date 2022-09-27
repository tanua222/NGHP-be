import HaaAssignableUserReportEntity from '../../../domain/entities/haa-assignable-user-report.entity';
import { BaseDaoOptions } from '../../base.dao';
import HaaBaseDao from '../../haa-base.dao';

export default class HaaAssignableUserReportDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'haaAssignableUserReportMapper',
      ...options,
    });
  }

  mapDbResultToEntity(results: any): HaaAssignableUserReportEntity[] {
    return HaaAssignableUserReportEntity.transform(results);
  }
}
