import { SortParam } from '../domain/dto/haa-common.dto';
import ExchangeGetEntity from '../domain/entities/exchange-get.entity';
import { BaseDaoOptions } from './base.dao';
import HaaBaseDao from './haa-base.dao';

export default class ExchangeGetDao extends HaaBaseDao {
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

}
