import HaaUnassignedUserRoleListDao from '../../../dao/features/haa-unassigned-user-role-list.dao';
import { HaaUserRoleListUnassignedMap } from '../../../domain/dtoEntityMap/haa-user-role-list-unassigned.map';
import HaaQueryParams from '../../../domain/entities/haa-query-param.entity';
import HaaUserRoleUnassignedEntity from '../../../domain/entities/haa-user-role-unassigned.entity';
import Context from '../../../utils/context';
import HaaBaseGetService from '../../haa-base-get.service';

export default class HaaUserRoleListUnassignedService extends HaaBaseGetService<HaaUnassignedUserRoleListDao> {
  constructor(context: Context) {
    super({ context, dao: new HaaUnassignedUserRoleListDao({ context }) });
  }

  isArray(): boolean {
    return true;
  }

  getQueryNameForRetrieve(entityQueryParams: HaaQueryParams): string {
    return 'findUnassignedRoles';
  }

  mapEntityToDto(ivsEntity: HaaUserRoleUnassignedEntity[]) {
    return HaaUserRoleListUnassignedMap.entityToDto(ivsEntity);
  }
}
