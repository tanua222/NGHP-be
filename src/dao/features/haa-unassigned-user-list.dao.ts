import HaaUserUnassignedEntity from '../../domain/entities/haa-user-unassigned.entity';
import { BaseDaoOptions } from '../base.dao';
import HaaBaseDao from '../haa-base.dao';

export default class HaaUnassignedUserListDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'haaUserRoleSearchMapper',
      ...options,
    });
  }

  mapDbResultToEntity(results: any): HaaUserUnassignedEntity[] {
    return HaaUserUnassignedEntity.transform(results);
  }
}
