import { NpaExchangeGetEntity } from '../../domain/entities/exchange/exchange-get.entity';
import { IvsConnection } from '../../utils/database';
import { BaseDaoOptions } from '../base.dao';
import ExchangeAddDao from './exchange-add.dao';

export default class ExchangeUpdateDao extends ExchangeAddDao {
  constructor(options: BaseDaoOptions) {
    super({
      ...options,
    });
  }

  mapDbResultToNpaExchangeEntity(results: any): NpaExchangeGetEntity[] {
    return NpaExchangeGetEntity.transform(results);
  }

  async updateExchange(params: any, conn?: IvsConnection) {
    return await this.validateAndExecuteTask('updateExchange', { params }, conn);
  }

  async executeGetNpaByExchange(params: any, conn?: IvsConnection) {
    let result = await this.findByFilters({ params: params, query: 'getNpaByExchange' });
    result = this.mapDbResultToNpaExchangeEntity(result);
    return result;
  }
}
