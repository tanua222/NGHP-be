import HaaAssignedUserRoleDao from '../../../dao/features/haa-assigned-user-role.dao';
import { AssignedUsersRequestParam } from '../../../domain/dto/haa-common.dto';
import { HaaUserAssignedDetailMap } from '../../../domain/dtoEntityMap/haa-user-assigned-detail.map';
import HaaUserAssignedDetailEntity from '../../../domain/entities/haa-user-assigned-detail.entity';
import HaaQueryParams from '../../../domain/entities/haa-query-param.entity';
import Context from '../../../utils/context';
import HaaBaseGetService from '../../haa-base-get.service';

export default class HaaUserAssignedDetailService extends HaaBaseGetService<HaaAssignedUserRoleDao> {
  constructor(context: Context) {
    super({ context, dao: new HaaAssignedUserRoleDao({ context }) });
  }

  getQueryNameForRetrieve(entityQueryParams: HaaQueryParams): string {
    return 'findAssignedUserDetails';
  }

  mapEntityToDto(ivsEntity: HaaUserAssignedDetailEntity[]) {
    return HaaUserAssignedDetailMap.entityToDto(ivsEntity);
  }

  mapToEntityQueryParams(requestParam: AssignedUsersRequestParam): HaaQueryParams {
    const haaEntityQueryParams: HaaQueryParams = new HaaQueryParams();

    requestParam.hierarchyNodeId && (haaEntityQueryParams.hnId = requestParam.hierarchyNodeId);
    requestParam.userId && (haaEntityQueryParams.userId = requestParam.userId);

    return haaEntityQueryParams;
  }
}
