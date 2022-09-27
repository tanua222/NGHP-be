import HaaUnassignedUserListDao from '../../../dao/features/haa-unassigned-user-list.dao';
import { HaaUserListUnassignedMap } from '../../../domain/dtoEntityMap/haa-user-list-unassigned.map';
import HaaQueryParams from '../../../domain/entities/haa-query-param.entity';
import HaaUserUnassignedEntity from '../../../domain/entities/haa-user-unassigned.entity';
import Context from '../../../utils/context';
import HaaBaseGetService from '../../haa-base-get.service';

export default class HaaUserListUnassignedService extends HaaBaseGetService<HaaUnassignedUserListDao> {
  constructor(context: Context) {
    super({ context, dao: new HaaUnassignedUserListDao({ context }) });
  }

  isArray(): boolean {
    return true;
  }

  getQueryNameForRetrieve(entityQueryParams: HaaQueryParams): string {
    return 'findUnassignedUsers';
  }

  mapEntityToDto(ivsEntity: HaaUserUnassignedEntity[]) {
    return HaaUserListUnassignedMap.entityToDto(ivsEntity);
  }
}
