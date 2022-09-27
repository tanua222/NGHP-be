import { AppConfig } from './app-config';
const config = <AppConfig>require('config');
export class DbConfig {
  static readonly cerptAdmin = config.dbConfig.cerptAdmin.enabled
    ? {
        enabled: config.dbConfig.cerptAdmin.enabled,
        user: config.dbConfig.cerptAdmin.user,
        connectString: config.dbConfig.cerptAdmin.connectString,
        password: process.env.ORADB_CERPT_ADMIN_PASSWORD,
        poolAlias: config.dbConfig.cerptAdmin.poolAlias,
        poolIncrement: config.dbConfig.cerptAdmin.poolIncrement,
        poolMax: config.dbConfig.cerptAdmin.poolMax,
        poolMin: config.dbConfig.cerptAdmin.poolMin,
        poolTimeout: config.dbConfig.cerptAdmin.poolTimeout,
        drainTime: config.dbConfig.cerptAdmin.drainTime,
        poolPingInterval: config.dbConfig.cerptAdmin.poolPingInterval,
        _enableStats: config.dbConfig.cerptAdmin.enableStatistics,
      }
    : {
        enabled: config.dbConfig.cerptAdmin.enabled,
        user: config.dbConfig.cerptAdmin.user,
        connectString: config.dbConfig.cerptAdmin.connectString,
        password: process.env.ORADB_CERPT_ADMIN_PASSWORD,
      };
}
