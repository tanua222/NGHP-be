import HaaUserRoleUnassignedEntity from '../../domain/entities/haa-user-role-unassigned.entity';
import { BaseDaoOptions } from '../base.dao';
import HaaBaseDao from '../haa-base.dao';

export default class HaaUnassignedUserRoleListDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'haaUserRoleSearchMapper',
      ...options,
    });
  }

  mapDbResultToEntity(results: any): HaaUserRoleUnassignedEntity[] {
    return HaaUserRoleUnassignedEntity.transform(results);
  }
}
