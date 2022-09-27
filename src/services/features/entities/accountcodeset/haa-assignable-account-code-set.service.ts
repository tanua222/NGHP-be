import { HaaAccountCodeSetDao } from '../../../../dao/features/entities/haa-account-code-set.dao';
import { AssignableAccountCodeSetRequestParam, RequestParam, SortParam } from '../../../../domain/dto/haa-common.dto';
import { HaaAssignableAccountCodeSetMap } from '../../../../domain/dtoEntityMap/haa-account-code-set.map';
import { HaaAccountCodeSetEntity } from '../../../../domain/entities/haa-account-code-set.entity';
import { HaaAssignableAccountCodeSetQueryParam } from '../../../../domain/entities/haa-query-param.entity';
import Context from '../../../../utils/context';
import HaaBaseGetService from '../../../haa-base-get.service';

export default class HaaAssignableAccountCodeSetService extends HaaBaseGetService<HaaAccountCodeSetDao> {
  constructor(context: Context) {
    super({ context, dao: new HaaAccountCodeSetDao({ context }) });
  }

  isPaginationRequired(requestParam?: RequestParam): boolean {
    return true;
  }

  isArray(): boolean {
    return true;
  }

  getDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
    return HaaAssignableAccountCodeSetMap.mapDtoToEntitySortParams(sortParams);
  }

  mapEntityToDto(ivsEntity: HaaAccountCodeSetEntity[]) {
    return HaaAssignableAccountCodeSetMap.entityToDto(ivsEntity);
  }

  mapToEntityQueryParams(requestParam: AssignableAccountCodeSetRequestParam): HaaAssignableAccountCodeSetQueryParam {
    const tfEntityQyueryParams: HaaAssignableAccountCodeSetQueryParam = super.mapToEntityQueryParams(requestParam);
    requestParam.accountCodeSetCode && (tfEntityQyueryParams.accountCodeSetCode = requestParam.accountCodeSetCode);
    requestParam.accountCodeSetDescription &&
      (tfEntityQyueryParams.accountCodeSetDescription = requestParam.accountCodeSetDescription);
    requestParam.parentHierarchyNodeId && (tfEntityQyueryParams.hnId = requestParam.parentHierarchyNodeId);
    return tfEntityQyueryParams;
  }

  getQueryNameForRetrieve(entityQueryParams: HaaAssignableAccountCodeSetQueryParam): string {
    return entityQueryParams?.paginationParam?.paginationRequired
      ? 'findAssignableACSByFiltersWithPagination'
      : 'findAssignableACSByFilters';
  }
}
