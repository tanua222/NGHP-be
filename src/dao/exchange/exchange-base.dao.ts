import { SortParam } from '../../domain/dto/haa-common.dto';
import { Error } from '../../domain/dto/response.dto';
import ExchangeGetEntity from '../../domain/entities/exchange/exchange-get.entity';
import { IvsConnection } from '../../utils/database';
import { BaseDaoOptions } from '../base.dao';
import HaaBaseDao from '../haa-base.dao';

export default class ExchangeBaseDao extends HaaBaseDao {
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

  async validateAndExecuteTask(mapperId: string, params: any, conn?: IvsConnection,) {
    if (!conn) throw Error.noDbConnection(this.dbConfig.poolAlias, mapperId);

    return await this.executeTask(mapperId, conn, { ...params, options: { autoCommit: false } });
  }
}
