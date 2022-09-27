import OracleDB from 'oracledb';
import { AppConfig } from './app-config';
import Context from './context';
const config = <AppConfig>require('config');

interface PooledConnection {
  con: IvsConnection;
  free: boolean;
  ctx: Context;
  whenTakenMillis: number;
}
class IvsConnectionPool {
  private static connections = new Map<string, PooledConnection[]>();

  static async getConnection(dbConfig: any, context: Context): Promise<IvsConnection> {
    const log = context.log;
    const connectionPoolName: string = dbConfig.poolAlias;

    let pooledConnections: PooledConnection[] | undefined = this.connections.get(connectionPoolName);
    let pooledCon: PooledConnection | undefined = pooledConnections?.find((c) => c.free);
    if (pooledCon) {
      pooledCon.free = false;
      pooledCon.ctx = context;
      pooledCon.whenTakenMillis = Date.now();
    } else {
      const conn: OracleDB.Connection = await OracleDB.getConnection(dbConfig);
      pooledCon = {
        con: new IvsConnection(conn),
        ctx: context,
        free: false,
        whenTakenMillis: Date.now(),
      };
      if (!pooledConnections) {
        pooledConnections = [];
        this.connections.set(connectionPoolName, pooledConnections);
      }
      pooledConnections.push(pooledCon);
    }
    return pooledCon.con;
  }
}
export class IvsConnection {
  private conn: OracleDB.Connection;
  constructor(connection: OracleDB.Connection) {
    this.conn = connection!;
  }

  async execute<T>(a: any, b: any, c: any): Promise<any> {
    return await this.conn.execute(a, b, c);
  }
  async commit() {
    return await this.conn.commit();
  }
  async rollback() {
    return await this.conn.rollback();
  }
  async close() {
    return await this.conn.close();
  }
  static async getConnection(dbConfig: any, context: Context): Promise<IvsConnection> {
    return IvsConnectionPool.getConnection(dbConfig, context);
  }
}
export default class DataBase {
  static closePool() {
    return;
  }
  static async initialize() {
    process.env.ORA_SDTZ = config.dbDateTimeZoneConfig.dbTimeZoneName;
  }
}
