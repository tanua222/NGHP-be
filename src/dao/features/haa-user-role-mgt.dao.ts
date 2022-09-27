import { Error } from '../../domain/dto/response.dto';
import { IvsConnection } from '../../utils/database';
import { BaseDaoOptions } from '../base.dao';
import HaaBaseDao from '../haa-base.dao';

export default class HaaUserRoleMgtDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'haaUserRoleMgtMapper',
      ...options,
    });
  }

  async assignUserToNode(params: any, conn?: IvsConnection) {
    await this.executeStoredProc('assignUserToNode', undefined, conn, { params });
  }

  async unassignUserFromNode(params: any, conn?: IvsConnection) {
    await this.executeStoredProc('unassignUserFromNode', undefined, conn, { params });
  }

  async updateAssignedUserRoleInNode(params: any, conn?: IvsConnection) {
    await this.executeStoredProc('updateAssignedUserRoleInNode', undefined, conn, { params });
  }

  async moveUserRoles(params: any, conn?: IvsConnection) {
    const mapperId = 'moveUserRoles';
    if (!conn) throw Error.noDbConnection(this.dbConfig.poolAlias, mapperId);
    return await this.executeTask(mapperId, conn, { params });
  }
}
