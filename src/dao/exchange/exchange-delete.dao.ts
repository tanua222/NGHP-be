import { IvsConnection } from '../../utils/database';
import { BaseDaoOptions } from '../base.dao';
import ExchangeBaseDao from './exchange-base.dao';

export default class ExchangeDeleteDao extends ExchangeBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      ...options,
    });
  }

  async executeDeleteMultipleNpaExchangesByAbbreviation(params: any, conn?: IvsConnection) {
    return await this.validateAndExecuteTask('deleteMultipleNpaExchangesByAbbreviation', { params }, conn);
  }

  async executeDeleteMultipleExchangesByAbbreviation(params: any, conn?: IvsConnection) {
    return await this.validateAndExecuteTask('deleteMultipleExchangesByAbbreviation', { params }, conn);
  }
}
