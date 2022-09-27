import oracledb from 'oracledb';
import { performance } from 'perf_hooks';
import PaginationResult from '../domain/dto/pagination-result.dto';
import ResponseDto, { Error } from '../domain/dto/response.dto';
import { BaseDaoDBErrorMapping } from '../error/database/base-dao-db-error-mapping';
import { DatabaseErrorMap } from '../error/database/db-base-class';
import { ErrorMapping } from '../error/error-responses-mapping';
import { AppConfig } from '../utils/app-config';
import Context from '../utils/context';
import { IvsConnection } from '../utils/database';
import { DbConfig } from '../utils/dbconfig';
import log from '../utils/logger';
import { isExternalUser, isValidParamString } from '../utils/util';
const mybatisMapper = require('mybatis-mapper');
const config = <AppConfig>require('config');

export class BaseArgs {
  params?: any;
  query?: string;
  options?: any;
  connection?: any;
  mapperNamespace?: string;
}

export class SingleValueArgs extends BaseArgs {
  alias: string;
  constructor() {
    super();
    this.alias = 'VAL';
  }
}

export interface BaseDaoOptions {
  mapperNamespace?: string;
  dbConfig?: any;
  context: any;
}

export interface BaseServiceOptions {
  context: any;
  dao: any;
}

export default class BaseDao {
  mapperNamespace: string;
  dbConfig: any;
  // properties : any;
  context: Context;
  log: any;
  isExternalUser: boolean = false;
  baseDaoArgsDefaults: BaseArgs;
  dbErrorMap: DatabaseErrorMap[];

  constructor(options: BaseDaoOptions) {
    this.mapperNamespace = options.mapperNamespace!;
    this.dbConfig = options.dbConfig || DbConfig.cerptAdmin;
    // this.properties = propertiesReader('src/rules/BusinessRules.properties');
    this.context = options.context;
    this.log = options.context?.log || log;
    this.dbErrorMap = BaseDaoDBErrorMapping;
    this.isExternalUser = isExternalUser(this.context);

    this.baseDaoArgsDefaults = {
      options: { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: false },
      mapperNamespace: this.mapperNamespace,
    };
  }

  transform(json: any) {
    return json;
  }

  async findById(args: BaseArgs) {
    const result = await this.getResult({ query: 'findById', ...args });
    const rows = result?.rows;
    return rows.length ? rows[0] : null;
  }

  async findByFilters(args: BaseArgs) {
    const result = await this.getResult({ query: 'findByFilters', ...args });
    return result?.rows || [];
  }

  async paginateByFilters(args: BaseArgs): Promise<PaginationResult> {
    const result = await this.getResult({ query: 'paginateByFilters', ...args });
    const presult = new PaginationResult();
    presult.rows = result?.rows || [];
    return presult;
  }

  async add(args: BaseArgs) {
    return await this.getResult({ query: 'addRecord', ...args });
  }

  async update(args: BaseArgs) {
    return await this.getResult({ query: 'updateRecord', ...args });
  }

  async delete(args: BaseArgs) {
    return await this.getResult({ query: 'deleteRecord', ...args });
  }

  async getResult(args: BaseArgs) {
    const { query, params, options, connection, mapperNamespace } = {
      ...this.baseDaoArgsDefaults,
      ...args,
    };
    if (connection) {
      return await this.executeTask(query, connection, { params, options, mapperNamespace });
    }
    return await this.execute(query, { params, options, mapperNamespace });
  }

  async getSingleValue(args: SingleValueArgs): Promise<any> {
    try {
      let res = await this.findByFilters(args);
      return res[0][args.alias];
    } catch (error) {
      this.log.error('getSingleValue error: ', error);
      throw new Error('DATABASE_SQL_SEQ_ERROR', 'Database SQL error.', 'Please check the logs for details.');
    }
  }

  async execute(
    sqlId: any,
    { params = {}, options = {}, mapperNamespace = this.mapperNamespace },
    dbConfig?: any
  ): Promise<any> {
    this.log.debug(`BaseDao.execute : sqlId: ${sqlId}`);
    let conn;
    try {
      conn = await IvsConnection.getConnection(dbConfig || this.dbConfig, this.context);
      this.validateParams(params);
      params = {
        ...params,
        isExternalUser: this.isExternalUser,
        uuid: this.context ? this.context.uuid : 'NoContextUUID',
        loginUserId: this.context ? this.context.userId : 'NoContextLoginUserId',
      };

      let sql = await mybatisMapper.getStatement(mapperNamespace, sqlId, params);
      sql = sql.replace(/(\r\n|\n|\r|\s{2,})/gm, ' ').trim();
      this.log.debug('BaseDao.execute sqlId: ' + sqlId + ' sql: ' + sql);
      let timestampBegin = Date.now();
      let result = await conn.execute<any>(sql, [], options);
      let timestampEnd = Date.now();
      if(config.enableQueryTime){
        let executionTime = timestampEnd - timestampBegin;
        this.log.debug("MapperNamespace: "+this.mapperNamespace+", SQLId: "+sqlId+", Query Execution Time: ",executionTime+"ms");
      }

      return result;
    } catch (err) {
      this.log.error(`BaseDao.execute Error in ${this.mapperNamespace}:${sqlId}`, err);
      this.handleDatabaseError(err, this.context, params);
    } finally {
      if (conn) {
        await conn.close();
      }
    }
  }

  async executeTask(
    sqlId: any,
    conn: IvsConnection,
    { params = {}, options = {}, mapperNamespace = this.mapperNamespace }
  ): Promise<any> {
    this.log.debug(`BaseDao.executeTask : sqlId: ${sqlId}`);
    try {
      this.validateParams(params);
      params = {
        ...params,
        isExternalUser: this.isExternalUser,
        uuid: this.context ? this.context.uuid : 'NoContextUUID',
        loginUserId: this.context ? this.context.userId : 'NoContextLoginUserId',
      };
      let sql = await mybatisMapper.getStatement(mapperNamespace, sqlId, params);
      sql = sql.replace(/(\r\n|\n|\r|\s{2,})/gm, ' ').trim();
      this.log.debug('BaseDao.executeTask sqlId: ' + sqlId + ' sql: ' + sql);
      let timestampBegin = Date.now();
      let result = await conn.execute<any>(sql, [], options);
      // this.log.debug('BaseDao.executeTask result:', result);
      let timestampEnd = Date.now();
      if(config.enableQueryTime){
        let executionTime = timestampEnd - timestampBegin;
        this.log.debug("MapperNamespace: "+this.mapperNamespace+", SQLId: "+sqlId+", Query Execution Time: ",executionTime+"ms");
      }
      return result;
    } catch (err) {
      this.log.error(`BaseDao.executeTask Error in ${this.mapperNamespace}:${sqlId}`, err);
      this.handleDatabaseError(err, this.context, params);
    }
  }

  async executeStoredProc(
    mapperId: string,
    dbConfig = this.dbConfig,
    connection: any = undefined,
    { params = {}, options = {}, bindParams = {}, mapperNamespace = this.mapperNamespace }
  ) {
    this.log.debug(`BaseDao.executeStoredProc : mapperId: ${mapperId}`);
    let conn: IvsConnection | undefined = undefined;
    try {
      conn = connection || (await IvsConnection.getConnection(dbConfig || this.dbConfig, this.context));
      if (!conn) throw Error.noDbConnection(dbConfig?.poolAlias || this.dbConfig.poolAlias, mapperId);

      this.validateParams(params);

      params = {
        ...params,
        isExternalUser: this.isExternalUser,
        uuid: this.context ? this.context.uuid : 'NoContextUUID',
        loginUserId: this.context ? this.context.userId : 'NoContextLoginUserId',
      };

      const sql = await mybatisMapper
        .getStatement(mapperNamespace, mapperId, params)
        .replace(/(\r\n|\n|\r|\t)/gm, ' ')
        .trim();
      this.log.info('base.dao. executeStoredProc sql: ' + sql);
      let timestampBegin = Date.now();
      let result = await conn.execute<any>(sql, bindParams, options);
      let timestampEnd = Date.now();
      if(config.enableQueryTime){
        let executionTime = timestampEnd - timestampBegin;
        this.log.debug("MapperNamespace: "+this.mapperNamespace+", SQLId: "+mapperId+", Query Execution Time: ",executionTime+"ms");
      }
      return result;
    } catch (error) {
      this.log.error(`BaseDao.executeStoredProc Error in ${mapperNamespace}: ${mapperId}`, error);
      if ((<any>error).errorNum >= 20100) {
        throw error;
      }

      throw new Error('DATABASE_STORED_PROC_ERROR', 'Database SQL error.', 'Please check the logs for details.');
    } finally {
      // if connection is not passed conn is initialized here
      // so conn should be closed here
      // if connection is passed , then it's responsibility of calling function to close it
      if (!connection && conn) {
        await conn.close();
      }
    }
  }

  async executeStoredProcOutRows(
    bindVars: any,
    mapperId: string,
    dbConfig = this.dbConfig,
    mapperNamespace = this.mapperNamespace
  ): Promise<any[]> {
    this.log.debug(
      'base.dao. executeStoredProcOutRows bindVars:' +
        JSON.stringify(bindVars) +
        ' mapperId:' +
        mapperId +
        ' dbConnection:' +
        this.dbConfig
    );
    let connection = undefined;
    try {
      let sql = await mybatisMapper.getStatement(mapperNamespace, mapperId, bindVars);
      sql = sql.replace(/(\r\n|\n|\r|\s{2,})/gm, ' ').trim();

      connection = await IvsConnection.getConnection(dbConfig || this.dbConfig, this.context);

      let rows: any[] = [];
      let rs: any;
      let timestampBegin = Date.now();
      await connection
        .execute<any>(
          sql,
          {
            out: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        )
        .then(async (result) => {
          let timestampEnd = Date.now();
          if(config.enableQueryTime){
            let executionTime = timestampEnd - timestampBegin;
            this.log.debug("MapperNamespace: "+this.mapperNamespace+", SQLId: "+mapperId+", Query Execution Time: ",executionTime+"ms");
          }
          rs = result.outBinds?.out;

          let nextRows = await rs?.getRows(100);

          while (nextRows.length) {
            rows = rows.concat(nextRows);
            nextRows = await rs?.getRows(100);
          }
        })
        .finally(() => {
          rs?.close();
          this.log.debug('BaseDao.executeStoredProcOutRows result set getting closed');
        });
      return rows;
    } catch (err) {
      this.log.error(`BaseDao.executeStoredProcOutRows Error in ${this.mapperNamespace}: ${mapperId}`, err);
      throw new Error('DATABASE_STORED_PROC_ROW_ERROR', 'Database SQL error.', 'Please check the logs for details.');
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  handleDatabaseError(error: any, context: Context, params: any): void {
    if (error instanceof ResponseDto) throw error;
    this.log.error(`BaseDao.handleDatabaseError:  ${error}`);
    const errorCode = error.errorNum ? String(error.errorNum).padStart(5, '0') : '-1';

    for (const errorDefinition of this.dbErrorMap) {
      if (errorDefinition.errorCode === errorCode) {
        const errObject = errorDefinition.constraint.find((err) => error.message.includes(err.constraint));
        if (errObject) {
          errObject.errorFunction(context, params);
        } else {
          this.log.error(`BaseDao.handleDatabaseError: could not find constraint `);
          throw new Error('DATABASE_SQL_ERROR', 'Database SQL error.', 'Please check the logs for details.');
        }
      }
    }

    throw new Error('DATABASE_SQL_ERROR', 'Database SQL error.', 'Please check the logs for details.');
  }

  validateParams(params: any): void {
    if (!isValidParamString(JSON.stringify(params))) {
      throw ResponseDto.badRequestErrorCode(this.context, ErrorMapping.IVSHAA4435, {});
    }
  }
}
