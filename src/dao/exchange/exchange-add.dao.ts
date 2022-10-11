import { SortParam } from '../../domain/dto/haa-common.dto';
import { Error } from '../../domain/dto/response.dto';
import ExchangeGetEntity from '../../domain/entities/exchange/exchange-get.entity';
import { IvsConnection } from '../../utils/database';
import { BaseDaoOptions } from '../base.dao';
import HaaBaseDao from '../haa-base.dao';

export default class ExchangeAddDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'exchangeMapper',
      ...options,
    });
  }

  mapDbResultToEntity(results: any): ExchangeGetEntity[] {
    return ExchangeGetEntity.transform(results);
  }

  mapEntityParamsToDbColumns(sortParams: SortParam[]): string[] {
    const sortConditions = sortParams
      ?.filter((s1: any) => ExchangeGetEntity.getDbColumnName(s1.fieldName))
      .map((s1: any) => {
        return { ...s1, fieldName: ExchangeGetEntity.getDbColumnName(s1.fieldName) };
      });
    return sortConditions;
  }

  async addExchange(params: any, conn?: IvsConnection) {
    const mapperId = 'addExchange';

    if (!conn) throw Error.noDbConnection(this.dbConfig.poolAlias, mapperId);

    return await this.executeTask(mapperId, conn, { params });
  }

  
  async addNpaExchange(params: any, conn?: IvsConnection) {
    const mapperId = 'addNpaExchange';

    if (!conn) throw Error.noDbConnection(this.dbConfig.poolAlias, mapperId);

    return await this.executeTask(mapperId, conn, { params });
  }  

  async getNpaExchId() {
    const dbResult = await this.findByFilters({
      query: 'getNpaExchId'
    });
    return dbResult[0].BNEM_NPA_EXCH_ID;
  
  }

  async countNpa(params: any, conn?: IvsConnection) {
    const mapperId = 'countNpa';

    if (!conn) throw Error.noDbConnection(this.dbConfig.poolAlias, mapperId);

    const dbResult = await this.executeTask(mapperId, conn, { params });

    return dbResult.rows[0];
  
  }
  

}
