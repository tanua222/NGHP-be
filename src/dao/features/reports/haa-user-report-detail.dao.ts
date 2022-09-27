import HaaUserReportDetailEntity from '../../../domain/entities/haa-user-report-detail.entity';
import { BaseDaoOptions } from '../../base.dao';
import HaaBaseDao from '../../haa-base.dao';

export default class HaaUserReportDetailDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'haaUserReportDetailMapper',
      ...options,
    });
  }

  mapDbResultToEntity(results: any): HaaUserReportDetailEntity[] {
    return HaaUserReportDetailEntity.transform(results);
  }
}
