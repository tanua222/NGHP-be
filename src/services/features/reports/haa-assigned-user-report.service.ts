import HaaAssignedUserReportDao from '../../../dao/features/reports/haa-assigned-user-report.dao';
import { AssignedUserReportRequestParam, RequestParam, SortParam } from '../../../domain/dto/haa-common.dto';
import HaaAssignedUserReportEntity from '../../../domain/entities/haa-assigned-user-report.entity';
import HaaQueryParams, { HaaAssignedUserReportQueryParam } from '../../../domain/entities/haa-query-param.entity';
import { HaaAssignedUserReportMap } from '../../../domain/dtoEntityMap/haa-assigned-user-report.map';
import Context from '../../../utils/context';
import HaaBaseGetService from '../../haa-base-get.service';
import { BASE_CORP_NODE_LEVEL } from '../../../utils/constants';

export default class HaaAssignedUserReportService extends HaaBaseGetService<HaaAssignedUserReportDao> {
  constructor(context: Context) {
    super({ context, dao: new HaaAssignedUserReportDao({ context }) });
  }

  isArray(): boolean {
    return true;
  }

  isPaginationRequired(requestParam?: RequestParam): boolean {
    return true;
  }

  getDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
    return HaaAssignedUserReportMap.mapDtoToEntitySortParams(sortParams);
  }

  addLoginUserIdParam() {
    return true;
  }

  mapEntityToDto(ivsEntity: HaaAssignedUserReportEntity[]) {
    return HaaAssignedUserReportMap.entityToDto(ivsEntity);
  }

  mapToEntityQueryParams(requestParam: AssignedUserReportRequestParam): HaaQueryParams {
    const haaEntityQueryParams: HaaAssignedUserReportQueryParam = super.mapToEntityQueryParams(requestParam);

    haaEntityQueryParams.parentHierarchyNodeName = requestParam.parentHierarchyNodeName;
    requestParam.parentHierarchyNodeLevel &&
      (haaEntityQueryParams.parentHierarchyNodeLevel = +requestParam.parentHierarchyNodeLevel + BASE_CORP_NODE_LEVEL);
    haaEntityQueryParams.reportCode = requestParam.reportCode;
    haaEntityQueryParams.reportDescription = requestParam.reportDescription;
    haaEntityQueryParams.recipientLoginName = requestParam.recipientLoginName;
    haaEntityQueryParams.reportLan = requestParam.language;
    haaEntityQueryParams.recipientUserId = requestParam.recipientUserId;
    haaEntityQueryParams.formatCode = requestParam.formatCode;

    return haaEntityQueryParams;
  }
}
