import { AppConfig } from '../utils/app-config';
import { RedisClient, RetryStrategyOptions } from 'redis';
import log from '../utils/logger';
import localCache from './local.cache';
const config = <AppConfig>require('config');

let localSet = async (keySpace: CacheKeySpace, key: string, value: string) => {
  return new Promise((res, rej) => {
    res(localCache.set(keySpace, key, value));
  });
};
let localHset = async (keySpace: CacheKeySpace, hash: string, key: string, value: string) => {
  return new Promise((res, rej) => {
    res(localCache.hset(keySpace, hash, key, value));
  });
};
let localGet = async (keySpace: CacheKeySpace, key: string): Promise<string | null> => {
  return new Promise((res, rej) => {
    res(localCache.get(keySpace, key));
  });
};
let localHget = async (keySpace: CacheKeySpace, hash: string, key: string): Promise<string | null> => {
  return new Promise((res, rej) => {
    res(localCache.hget(keySpace, hash, key));
  });
};
let localDel = async (keySpace: CacheKeySpace, key: string): Promise<number> => {
  return new Promise((res, rej) => {
    res(localCache.del(keySpace, key) ? 1 : 0);
  });
};

let isConnected = () => false;
let set = localSet;
let get = localGet;
let hset = localHset;
let hget = localHget;
let del = localDel;

if (config.remoteCache?.enabled) {
  const redisClient = new RedisClient({
    host: config.remoteCache.host,
    port: config.remoteCache.port,
    retry_strategy: function (options: RetryStrategyOptions) {
      if (options.attempt > 100) return 600000;
      else if (options.attempt > 10) return 60000;
      else return 6000;
    },
  });

  redisClient.on('ready', () => {
    console.log('cache ready');
    set = async (keySpace: CacheKeySpace, key: string, value: string) => {
      return new Promise((res, rej) => {
        redisClient.set(keySpace + key, value, (err, ok) => {
          if (err) rej(err);
          else res(ok);
        });
      });
    };
    hset = async (keySpace: CacheKeySpace, hash: string, key: string, value: string) => {
      return new Promise((res, rej) => {
        redisClient.hset(keySpace + hash, key, value, (err, ok) => {
          if (err) rej(err);
          else res(ok);
        });
      });
    };
    get = async (keySpace: CacheKeySpace, key: string): Promise<string | null> => {
      return new Promise((res, rej) => {
        redisClient.get(keySpace + key, (err, val) => {
          log.debug(`------------CACHE ${val ? 'HIT' : 'MISS'}------------`);
          if (err) rej(err);
          else res(val);
        });
      });
    };
    hget = async (keySpace: CacheKeySpace, hash: string, key: string): Promise<string | null> => {
      return new Promise((res, rej) => {
        redisClient.hget(keySpace + hash, key, (err, val) => {
          log.debug(`------------CACHE ${val ? 'HIT' : 'MISS'}------------`);
          if (err) rej(err);
          else res(val);
        });
      });
    };
    del = async (keySpace: CacheKeySpace, key: string): Promise<number> => {
      return new Promise((res, rej) => {
        redisClient.del(keySpace + key, (e, n) => {
          e ? rej(e) : res(n);
        });
      });
    };
    isConnected = () => true;
  });
  redisClient.on('end', () => {
    log.info('cache not ready');
    isConnected = () => false;
    set = localSet;
    get = localGet;
    hset = localHget;
    hget = localHget;
    del = localDel;
  });
  redisClient.on('error', () => {
    log.error('cache error');
  });
}

enum CacheKeySpace {
  AUTH = 'AUTH',
  CORP_OF_ENTITY = 'CORP_OF_ENTITY',
  ENTITY_TYPE = 'ENTITY_TYPE',
  LD_REST = 'LD_REST',
  USER = 'USER',
}
export default { isConnected, hget, set, hset, get, del, CacheKeySpace };
