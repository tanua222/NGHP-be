import { SortParam } from '../domain/dto/haa-common.dto';
import ExchangeEntity from '../domain/entities/exchange.entity';
import { BaseDaoOptions } from './base.dao';
import HaaBaseDao from './haa-base.dao';


export default class ExchangeDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'exchangeMapper',
      ...options,
    });
  }

  mapDbResultToEntity(results: any): ExchangeEntity[] {
    return ExchangeEntity.transform(results);
  }

  mapEntityParamsToDbColumns(sortParams: SortParam[]): string[] {
    const sortConditions = sortParams
      ?.filter((s1: any) => ExchangeEntity.getDbColumnName(s1.fieldName))
      .map((s1: any) => {
        return { ...s1, fieldName: ExchangeEntity.getDbColumnName(s1.fieldName) };
      });
    return sortConditions;
  }
}
