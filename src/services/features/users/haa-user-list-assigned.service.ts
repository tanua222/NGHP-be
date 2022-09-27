import HaaAssignedUserListDao from '../../../dao/features/haa-assigned-user-list.dao';
import {
  AssignedUsersRequestParam as AssignedUserRequestParam,
  RequestParam,
  SortParam,
} from '../../../domain/dto/haa-common.dto';
import ResponseDto from '../../../domain/dto/response.dto';
import { HaaUserListAssignedMap as HaaUserListAssignedMap } from '../../../domain/dtoEntityMap/haa-user-list-assigned.map';
import HaaQueryParams, {
  HaaAssignedUserRoleListQueryParam as HaaAssignedUserListQueryParam,
} from '../../../domain/entities/haa-query-param.entity';
import HaaUserAssignedEntity from '../../../domain/entities/haa-user-assigned.entity';
import { ErrorMapping } from '../../../error/error-responses-mapping';
import { BASE_CORP_NODE_LEVEL } from '../../../utils/constants';
import Context from '../../../utils/context';
import { isNotEmpty, isNullOrUndefined } from '../../../utils/util';
import HaaBaseGetService from '../../haa-base-get.service';

export default class HaaUserListAssignedService extends HaaBaseGetService<HaaAssignedUserListDao> {
  constructor(context: Context) {
    super({ context, dao: new HaaAssignedUserListDao({ context }) });
  }

  validateInput(haaQueryParams: HaaQueryParams) {
    const { corporationId, parentHnId } = haaQueryParams;

    if (isNullOrUndefined(corporationId) && isNullOrUndefined(parentHnId)) {
      throw ResponseDto.badRequestErrorCode(this.context, ErrorMapping.IVSHAA4405, [
        {
          key: 'corporationId',
          value: null,
        },
        {
          key: 'parentHierarchyNodeId',
          value: null,
        },
      ]);
    }
  }

  getQueryNameForRetrieve(entityQueryParams: HaaQueryParams): string {
    return 'findAssignedUsers';
  }

  isPaginationRequired(requestParam?: RequestParam): boolean {
    return true;
  }

  isArray(): boolean {
    return true;
  }

  getDtoToEntitySortParams(sortParams: SortParam[]): SortParam[] {
    return HaaUserListAssignedMap.mapDtoToEntitySortParams(sortParams);
  }

  mapEntityToDto(ivsEntity: HaaUserAssignedEntity[]) {
    return HaaUserListAssignedMap.entityToDto(ivsEntity);
  }

  mapToEntityQueryParams(requestParam: AssignedUserRequestParam): HaaAssignedUserListQueryParam {
    const haaEntityQueryParams: HaaAssignedUserListQueryParam = super.mapToEntityQueryParams(requestParam);

    requestParam.parentHierarchyNodeName && (haaEntityQueryParams.nodeName = requestParam.parentHierarchyNodeName);
    requestParam.userLastName && (haaEntityQueryParams.lastName = requestParam.userLastName);
    requestParam.userFirstName && (haaEntityQueryParams.firstName = requestParam.userFirstName);
    requestParam.userLogin && (haaEntityQueryParams.loginUserName = requestParam.userLogin);

    if (isNotEmpty(requestParam.parentHierarchyNodeLevel)) {
      const srchNodeLevel = Number(requestParam.parentHierarchyNodeLevel);
      if (Number.isNaN(srchNodeLevel)) {
        haaEntityQueryParams.nodeLevel = -1;
      } else {
        haaEntityQueryParams.nodeLevel = srchNodeLevel + BASE_CORP_NODE_LEVEL;
      }
    }

    return haaEntityQueryParams;
  }

  addLoginUserIdParam() {
    return true;
  }

  async findUsersByHnId(id: string): Promise<HaaUserAssignedEntity[]> {
    return this.dao.findUsersByHnId(id);
  }
}
