import { HaaIdCodeSetDao } from '../../../../dao/features/entities/haa-id-code-set.dao';
import { AssignableIdCodeSetRequestParam, RequestParam, SortParam } from '../../../../domain/dto/haa-common.dto';
import { HaaAssignableIdCodeSetMap } from '../../../../domain/dtoEntityMap/haa-id-code-set.map';
import HaaIdCodeSetEntity from '../../../../domain/entities/haa-id-code-set.entity';
import { HaaAssignableIdCodeSetQueryParam } from '../../../../domain/entities/haa-query-param.entity';
import Context from '../../../../utils/context';
import HaaBaseGetService from '../../../haa-base-get.service';

export default class HaaAssignableIdCodeSetService extends HaaBaseGetService<HaaIdCodeSetDao> {
  constructor(context: Context) {
    super({ context, dao: new HaaIdCodeSetDao({ context }) });
  }

  isPaginationRequired(requestParam?: RequestParam): boolean {
    return true;
  }

  isArray(): boolean {
    return true;
  }

  getDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
    return HaaAssignableIdCodeSetMap.mapDtoToEntitySortParams(sortParams);
  }

  mapEntityToDto(ivsEntity: HaaIdCodeSetEntity[]) {
    return HaaAssignableIdCodeSetMap.entityToDto(ivsEntity);
  }

  mapToEntityQueryParams(requestParam: AssignableIdCodeSetRequestParam): HaaAssignableIdCodeSetQueryParam {
    const tfEntityQyueryParams: HaaAssignableIdCodeSetQueryParam = super.mapToEntityQueryParams(requestParam);
    requestParam.idCodeSetCode && (tfEntityQyueryParams.idCodeSetCode = requestParam.idCodeSetCode);
    requestParam.idCodeSetDescription &&
      (tfEntityQyueryParams.idCodeSetDescription = requestParam.idCodeSetDescription);
    requestParam.parentHierarchyNodeId && (tfEntityQyueryParams.hnId = requestParam.parentHierarchyNodeId);
    return tfEntityQyueryParams;
  }

  getQueryNameForRetrieve(entityQueryParams: HaaAssignableIdCodeSetQueryParam): string {
    return entityQueryParams?.paginationParam?.paginationRequired
      ? 'findAssignableByFiltersWithPagination'
      : 'findAssignableByFilters';
  }
}
