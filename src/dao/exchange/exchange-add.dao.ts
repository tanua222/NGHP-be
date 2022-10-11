import { IvsConnection } from '../../utils/database';
import { BaseDaoOptions } from '../base.dao';
import ExchangeBaseDao from './exchange-base.dao';

export default class ExchangeAddDao extends ExchangeBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      ...options,
    });
  }

  async addExchange(params: any, conn?: IvsConnection) {
    return await this.validateAndExecuteTask('addExchange', { params }, conn);
  }

  async addNpaExchange(params: any, conn?: IvsConnection) {
    return await this.validateAndExecuteTask('addNpaExchange', { params }, conn);
  }

  async getNpaExchId() {
    const dbResult = await this.findByFilters({
      query: 'getNpaExchId'
    });
    return dbResult[0].BNEM_NPA_EXCH_ID;
  }

  async countNpa(params: any, conn?: IvsConnection) {
    const dbResult = await this.validateAndExecuteTask('countNpa', { params }, conn);
    return dbResult.rows[0];
  }
}
