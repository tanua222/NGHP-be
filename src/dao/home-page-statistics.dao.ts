import oracledb from 'oracledb';
import { BaseDaoOptions } from './base.dao';
import HaaBaseDao from './haa-base.dao';
import HomePageStatisticsEntity from '../domain/entities/home-page-statistics.entity';

export default class HomePageStatisticsDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'homePageStatisticsMapper',
      ...options,
    });
  }

  // async executeWithQueryName(query = 'homePageStatistics') {
  //   this.log.debug('HomePageStatisticsDao.executeWithQueryName : queryName :' + query);
  //   let result = await this.execute(query, { options: { outFormat: oracledb.OUT_FORMAT_OBJECT } });
  //   const dbResults = result?.rows || [];

  //   const entities = dbResults?.length > 0 ? this.mapDbResultToEntity(dbResults) : undefined;
  //   return entities;
  // }

  // async statistics() {
  //   this.log.debug('select home page statistics');
  //   return await this.executeWithQueryName('homePageStatistics');
  // }

  mapDbResultToEntity(results: any): HomePageStatisticsEntity[] {
    return HomePageStatisticsEntity.transform(results);
  }
}
