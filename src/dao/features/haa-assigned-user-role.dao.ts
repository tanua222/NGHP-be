import HaaUserAssignedDetailEntity from '../../domain/entities/haa-user-assigned-detail.entity';
import { BaseDaoOptions } from '../base.dao';
import HaaBaseDao from '../haa-base.dao';

export default class HaaAssignedUserRoleDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'haaUserRoleSearchMapper',
      ...options,
    });
  }

  mapDbResultToEntity(results: any): HaaUserAssignedDetailEntity[] {
    return HaaUserAssignedDetailEntity.transform(results);
  }
}
