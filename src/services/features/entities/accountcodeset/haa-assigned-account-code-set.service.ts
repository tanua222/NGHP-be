import { HaaAccountCodeSetDao } from '../../../../dao/features/entities/haa-account-code-set.dao';
import { AssignedAccountCodeSetRequestParam, RequestParam, SortParam } from '../../../../domain/dto/haa-common.dto';
import { HaaAssignedAccountCodeSetMap } from '../../../../domain/dtoEntityMap/haa-account-code-set.map';
import { HaaAccountCodeSetEntity } from '../../../../domain/entities/haa-account-code-set.entity';
import { HaaAssignedAccountCodeSetQueryParam } from '../../../../domain/entities/haa-query-param.entity';
import Context from '../../../../utils/context';
import HaaBaseGetService from '../../../haa-base-get.service';

export default class HaaAssignedAccountCodeSetService extends HaaBaseGetService<HaaAccountCodeSetDao> {
  permissionDescriptions: string[];

  constructor(context: Context) {
    super({ context, dao: new HaaAccountCodeSetDao({ context }) });
  }

  isPaginationRequired(requestParam?: RequestParam): boolean {
    return true;
  }

  isArray(): boolean {
    return true;
  }

  addLoginUserIdParam() {
    return true;
  }

  getDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
    return HaaAssignedAccountCodeSetMap.mapDtoToEntitySortParams(sortParams);
  }

  mapEntityToDto(ivsEntity: HaaAccountCodeSetEntity[]) {
    return HaaAssignedAccountCodeSetMap.entityToDto(ivsEntity);
  }

  mapToEntityQueryParams(requestParam: AssignedAccountCodeSetRequestParam): HaaAssignedAccountCodeSetQueryParam {
    const tfEntityQyueryParams: HaaAssignedAccountCodeSetQueryParam = super.mapToEntityQueryParams(requestParam);
    requestParam.accountCodeSetCode && (tfEntityQyueryParams.accountCodeSetCode = requestParam.accountCodeSetCode);
    requestParam.accountCodeSetName && (tfEntityQyueryParams.accountCodeSetName = requestParam.accountCodeSetName);
    requestParam.parentHierarchyNodeName &&
      (tfEntityQyueryParams.parentHierarchyNodeName = requestParam.parentHierarchyNodeName);
    requestParam.parentHierarchyNodeLevel &&
      (tfEntityQyueryParams.parentHierarchyNodeLevel = Number(requestParam.parentHierarchyNodeLevel));
    requestParam.parentHierarchyNodeId &&
      (tfEntityQyueryParams.parentHierarchyNodeId = requestParam.parentHierarchyNodeId);

    tfEntityQyueryParams.loginUser = this.context.uuid;
    tfEntityQyueryParams.permissionDescription = this.permissionDescriptions;
    return tfEntityQyueryParams;
  }

  getQueryNameForRetrieve(entityQueryParams: HaaAssignedAccountCodeSetQueryParam): string {
    return entityQueryParams?.paginationParam?.paginationRequired
      ? 'findAssignedACSByFiltersWithPagination'
      : 'findAssignedACSByFilters';
  }
}
