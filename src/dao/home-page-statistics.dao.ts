import { SortParam } from '../domain/dto/haa-common.dto';
import HomePageStatisticsEntity from '../domain/entities/home-page-statistics.entity';
import { BaseDaoOptions } from './base.dao';
import HaaBaseDao from './haa-base.dao';


export default class HomePageStatisticsDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'homePageStatisticsMapper',
      ...options,
    });
  }

  mapDbResultToEntity(results: any): HomePageStatisticsEntity[] {
    return HomePageStatisticsEntity.transform(results);
  }

  mapEntityParamsToDbColumns(sortParams: SortParam[]): string[] {
    const sortConditions = sortParams
      ?.filter((s1: any) => HomePageStatisticsEntity.getDbColumnName(s1.fieldName))
      .map((s1: any) => {
        return { ...s1, fieldName: HomePageStatisticsEntity.getDbColumnName(s1.fieldName) };
      });
    return sortConditions;
  }
}
