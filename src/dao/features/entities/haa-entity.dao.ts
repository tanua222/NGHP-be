import { Error } from '../../../domain/dto/response.dto';
import BaseEntity from '../../../domain/entities/base.entity';
import HaaExtractEntity from '../../../domain/entities/haa-extract.entity';
import { IvsConnection } from '../../../utils/database';
import { BaseDaoOptions } from '../../base.dao';
import HaaBaseDao from '../../haa-base.dao';

export default class HaaEntityDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'haaEntityMapper',
      ...options,
    });
  }

  async assign(params: any, conn?: IvsConnection) {
    const mapperId = 'assign';
    if (!conn) throw Error.noDbConnection(this.dbConfig.poolAlias, mapperId);
    return await this.executeTask(mapperId, conn, { params });
  }

  async unassign(params: any, conn?: IvsConnection) {
    const mapperId = 'unassign';
    if (!conn) throw Error.noDbConnection(this.dbConfig.poolAlias, mapperId);
    return await this.executeTask(mapperId, conn, { params });
  }

  async moveNodeEntities(params: any, conn?: IvsConnection) {
    const mapperId = 'moveNodeEntities';
    if (!conn) throw Error.noDbConnection(this.dbConfig.poolAlias, mapperId);
    return await this.executeTask(mapperId, conn, { params });
  }

  async findHierarchyNodeByParams(args: any): Promise<any[]> {
    const param = {
      ...args,
    };

    const dbResult = await this.findByFilters({
      query: 'findNodeIdListByEntityNodeIdList',
      params: param,
      mapperNamespace: 'haaEntityMapper',
    });

    return this.transform(dbResult);
  }

  async findBySeqId(args: any): Promise<any[]> {
    const param = {
      ...args,
    };

    const dbResult = await this.findByFilters({
      query: 'findBySeqId',
      params: param,
    });

    return this.transform(dbResult);
  }
}
