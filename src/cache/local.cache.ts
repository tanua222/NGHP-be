const cache = new Map<string, any>();
const defaultTTL = 60 * 60 * 1000;

const hset = (keySpace: CacheKeySpace, hash: string, key: string, value: any, ttl?: number) => {
  let expiry = Date.now() + (ttl || defaultTTL);
  let hashStore = cache.get(keySpace + hash);
  if (!hashStore) {
    hashStore = new Map<string, any>();
    cache.set(keySpace + hash, hashStore);
  }
  hashStore.set(key, { value, expiry });
};
const set = (keySpace: CacheKeySpace, key: string, value: string, ttl?: number) => {
  let expiry = Date.now() + (ttl || defaultTTL);
  cache.set(keySpace + key, { value, expiry });
};
const hget = (keySpace: CacheKeySpace, hash: string, key: string): string | null => {
  let hashStore = cache.get(keySpace + hash);
  if (!hashStore) {
    return null;
  }
  const valObj = hashStore.get(key);
  if (!valObj) return null;
  else if (valObj.expiry < Date.now()) {
    hashStore.delete(key);
    return null;
  } else return valObj.value;
};
const get = (keySpace: CacheKeySpace, key: string): string | null => {
  const valObj = cache.get(keySpace + key);
  if (!valObj) return null;
  else if (valObj.expiry < Date.now()) {
    cache.delete(keySpace + key);
    return null;
  } else return valObj.value;
};
const del = (keySpace: CacheKeySpace, key: string): boolean => {
  return cache.delete(keySpace + key);
};

enum CacheKeySpace {
  AUTH = 'AUTH',
  CORP_OF_ENTITY = 'CORP_OF_ENTITY',
  ENTITY_TYPE = 'ENTITY_TYPE',
  LD_REST = 'LD_REST',
  USER = 'USER',
}
export default { set, get, del, hget, hset, CacheKeySpace };
