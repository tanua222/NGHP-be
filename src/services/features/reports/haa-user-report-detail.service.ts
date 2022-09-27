import HaaUserReportDetailDao from '../../../dao/features/reports/haa-user-report-detail.dao';
import { UserReportDetailRequestParam } from '../../../domain/dto/haa-common.dto';
import { HaaUserReportDetailMap } from '../../../domain/dtoEntityMap/haa-user-report-detail.map';
import HaaQueryParams, { HaaUserReportDetailQueryParam } from '../../../domain/entities/haa-query-param.entity';
import HaaUserReportDetailEntity from '../../../domain/entities/haa-user-report-detail.entity';
import Context from '../../../utils/context';
import HaaBaseGetService from '../../haa-base-get.service';

export default class HaaUserReportDetailService extends HaaBaseGetService<HaaUserReportDetailDao> {
  constructor(context: Context) {
    super({ context, dao: new HaaUserReportDetailDao({ context }) });
  }

  mapEntityToDto(ivsEntity: HaaUserReportDetailEntity[]) {
    return HaaUserReportDetailMap.entityToDto(ivsEntity);
  }

  mapToEntityQueryParams(requestParam: UserReportDetailRequestParam): HaaQueryParams {
    const haaEntityQueryParams: HaaUserReportDetailQueryParam = super.mapToEntityQueryParams(requestParam);

    haaEntityQueryParams.assignedReportId = requestParam.assignedReportId;

    return haaEntityQueryParams;
  }
}
