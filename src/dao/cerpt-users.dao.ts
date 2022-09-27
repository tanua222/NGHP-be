import BaseDao, { BaseDaoOptions } from './base.dao';

export default class CerptUsersDao extends BaseDao {
  constructor(options: BaseDaoOptions) {
    super({ mapperNamespace: 'cerptUsersMapper', ...options });
  }
}
