import oracledb from 'oracledb';
import { BaseDaoOptions } from './base.dao';
import HaaBaseDao from './haa-base.dao';

export default class HealthCheckDao extends HaaBaseDao {
  constructor(options: BaseDaoOptions) {
    super({
      mapperNamespace: 'healthCheckMapper',
      ...options,
    });
  }

  async executeWithQueryName(query = 'healthCheck') {
    this.log.debug('HealthCheckDao.executeWithQueryName : queryName :' + query);
    let result = await this.execute(query, { options: { outFormat: oracledb.OUT_FORMAT_OBJECT } });
    return result;
  }

  async healthCheck() {
    this.log.debug('Health Check Call..');
    return await this.executeWithQueryName('healthCheck');
  }
}
