import HaaAssignedTollfreeDao from '../../../../dao/features/entities/haa-assgined-tollfree.dao';
import { AssignedTollfreeRequestParam, RequestParam, SortParam } from '../../../../domain/dto/haa-common.dto';
import { HaaAssignedTollfreeMap } from '../../../../domain/dtoEntityMap/haa-assigned-tollfree.map';
import HaaAssignedTollfreeEntity from '../../../../domain/entities/haa-assgined-tollfree.entity';
import { HaaAssignedTollfreeQueryParam } from '../../../../domain/entities/haa-query-param.entity';
import Context from '../../../../utils/context';
import HaaBaseGetService from '../../../haa-base-get.service';
import HaaTollfreeValidatorService from '../../../validator/features/entities/haa-tollfree-validation.service';

export default class HaaAssignedTollfreeService extends HaaBaseGetService<HaaAssignedTollfreeDao> {
  permissionDescriptions: string[];
  constructor(context: Context) {
    super({ context, dao: new HaaAssignedTollfreeDao({ context }) });
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
    return HaaAssignedTollfreeMap.mapDtoToEntitySortParams(sortParams);
  }

  mapEntityToDto(ivsEntity: HaaAssignedTollfreeEntity[]) {
    return HaaAssignedTollfreeMap.entityToDto(ivsEntity);
  }

  mapToEntityQueryParams(requestParam: AssignedTollfreeRequestParam): HaaAssignedTollfreeQueryParam {
    const tfEntityQyueryParams: HaaAssignedTollfreeQueryParam = super.mapToEntityQueryParams(requestParam);
    requestParam.tollfreeNumber && (tfEntityQyueryParams.tollfreeNumber = requestParam.tollfreeNumber);
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

  async validateInput(queryParams: HaaAssignedTollfreeQueryParam) {
    const validationService = new HaaTollfreeValidatorService(this.dao);
    validationService.validateInputForGetAssigned(queryParams);
  }
}
