import HaaUserReportDao from '../../../dao/features/reports/haa-user-report.dao';
import Context from '../../../utils/context';
import { IvsConnection } from '../../../utils/database';
import HaaBasePatchService from '../../haa-base-patch.service';
import { UserReportDetailRequestParam } from '../../../domain/dto/haa-common.dto';
import HaaQueryParams, { HaaUserReportDetailQueryParam } from '../../../domain/entities/haa-query-param.entity';
import { HaaUserReportMap } from '../../../domain/dtoEntityMap/haa-user-report.map';
import HaaAssignedUserReportEntity from '../../../domain/entities/haa-assigned-user-report.entity';
import HaaUserReportValidatorService from '../../validator/reports/haa-user-report-validation.service';

export default class HaaUserReportPatchService extends HaaBasePatchService<HaaUserReportDao> {
  conn: IvsConnection;

  constructor(context: Context) {
    super({ context, dao: new HaaUserReportDao({ context }) });
  }

  mapDtoToEntity(requestParam: UserReportDetailRequestParam): HaaAssignedUserReportEntity[] {
    return [HaaUserReportMap.dtoToEntityForUpdate(requestParam)];
  }

  async mapToEntityQueryParams(requestParam: UserReportDetailRequestParam): Promise<HaaUserReportDetailQueryParam> {
    const queryParam = <HaaUserReportDetailQueryParam>await super.mapToEntityQueryParams(requestParam);
    queryParam.assignedReportId = requestParam.assignedReportId;
    return queryParam;
  }

  async validateInput(queryParams: HaaQueryParams) {
    const validationService = new HaaUserReportValidatorService(this.dao);
    await validationService.validateInputForUpdate(queryParams);
  }
}
