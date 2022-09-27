import HaaAssignedIdCodeSetDao from '../../../../dao/features/entities/haa-assgined-id-code-set.dao';
import { AssignedIdCodeSetRequestParam, RequestParam, SortParam } from '../../../../domain/dto/haa-common.dto';
import { HaaAssignedIdCodeSetMap } from '../../../../domain/dtoEntityMap/haa-assgined-id-code-set.map';
import HaaAssignedIdCodeSetEntity from '../../../../domain/entities/haa-assgined-id-code-set.entity';
import { HaaAssignedIdCodeSetQueryParam } from '../../../../domain/entities/haa-query-param.entity';
import Context from '../../../../utils/context';
import HaaBaseGetService from '../../../haa-base-get.service';

export default class HaaAssignedIdCodeSetService extends HaaBaseGetService<HaaAssignedIdCodeSetDao> {
  permissionDescriptions: string[];

  constructor(context: Context) {
    super({ context, dao: new HaaAssignedIdCodeSetDao({ context }) });
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
    return HaaAssignedIdCodeSetMap.mapDtoToEntitySortParams(sortParams);
  }

  mapEntityToDto(ivsEntity: HaaAssignedIdCodeSetEntity[]) {
    return HaaAssignedIdCodeSetMap.entityToDto(ivsEntity);
  }

  mapToEntityQueryParams(requestParam: AssignedIdCodeSetRequestParam): HaaAssignedIdCodeSetQueryParam {
    const tfEntityQyueryParams: HaaAssignedIdCodeSetQueryParam = super.mapToEntityQueryParams(requestParam);
    requestParam.parentHierarchyNodeName &&
      (tfEntityQyueryParams.parentHierarchyNodeName = requestParam.parentHierarchyNodeName);
    requestParam.parentHierarchyNodeLevel &&
      (tfEntityQyueryParams.parentHierarchyNodeLevel = Number(requestParam.parentHierarchyNodeLevel));
    requestParam.parentHierarchyNodeId &&
      (tfEntityQyueryParams.parentHierarchyNodeId = requestParam.parentHierarchyNodeId);
    requestParam.idCodeSetCode && (tfEntityQyueryParams.idCodeSetCode = requestParam.idCodeSetCode);
    requestParam.idCodeSetDescription &&
      (tfEntityQyueryParams.idCodeSetDescription = requestParam.idCodeSetDescription);
    tfEntityQyueryParams.loginUser = this.context.uuid;
    tfEntityQyueryParams.permissionDescription = this.permissionDescriptions;
    return tfEntityQyueryParams;
  }
}
