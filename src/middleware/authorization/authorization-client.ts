import { AppConfig } from '../../utils/app-config';
import { AxiosInstance, AxiosResponse } from 'axios';
import { FIND_USER_PATH, USER_AUTH_PATH } from '../../utils/constants';
import cache from '../../cache/cache';
import appApiTokenService from '../authentication/app-api-token.service';
import Context from '../../utils/context';
const axios = require('axios');
const appConfig = <AppConfig>require('config');

const axiosInstances: Map<string, AxiosInstance> = new Map();

function getApplicationApiAxiosInstance(connectionId: string) {
  let instance = getAxios(connectionId, appConfig.applicationApi.get(connectionId)?.baseUrl || '');
  axiosInstances.set(connectionId, instance);

  //Adding a auth token for any service call
  instance.interceptors.request.use(async function (config) {
    // get the token to connect to application api and not use the access token
    // coming from the gui
    const token = await appApiTokenService.getToken(connectionId);
    if (token) {
      // put the authorization token in user token as that's coming from gui having user information
      config.headers['usertoken'] = config.headers['usertoken']
        ? config.headers['usertoken']?.replace('Bearer ', '')
        : config.headers['authorization']?.replace('Bearer ', '');
      // new token retrieved to connect between two servers should be passed as authorization
      config.headers['authorization'] = 'Bearer ' + token;
      config.headers['env'] = appConfig.kongNpEnv;
    }
    return config;
  });

  return instance;
}

function getAxios(instanceName: string, baseUrl: string): AxiosInstance {
  let axiosInstance = axiosInstances.get(instanceName);
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 120000,
      proxy: false,
    });
    axiosInstances.set(instanceName, axiosInstance!);
  }
  return axiosInstance!;
}

let userInformationInstance: AxiosInstance = getApplicationApiAxiosInstance('userInformation');

export const isAuthorized = async (authRequest: any, context: Context): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const cacheKey = JSON.stringify(authRequest);
    cache.get(cache.CacheKeySpace.AUTH, cacheKey).then((val) => {
      if (val) {
        const resp = JSON.parse(val);
        resolve(resp === true);
      } else {
        // SSO change : inject authorization for other API calls
        userInformationInstance
          .get(USER_AUTH_PATH, {
            params: authRequest,
            headers: {
              authorization: context.get('authorization') || 'Bearer ',
              usertoken: context.get('usertoken'),
              'x-session-traceid': context.get('sessionTraceId'),
              'x-request-traceid': context.get('requestTraceId'),
            },
            proxy: false,
          })
          .then((resp: AxiosResponse) => {
            cache.set(cache.CacheKeySpace.AUTH, cacheKey, JSON.stringify(resp.data.isAuthorized));
            resolve(resp.data.isAuthorized === true);
          })
          .catch(reject);
      }
    });
  });
};

export const findUserByParam = async (userRequest: any, context: Context) => {
  return new Promise((resolve, reject) => {
    const cacheKey = JSON.stringify(userRequest);
    cache.get(cache.CacheKeySpace.USER, cacheKey).then((val) => {
      if (val) {
        const resp = JSON.parse(val);
        resolve(resp);
      } else {
        userInformationInstance
          .get(FIND_USER_PATH, {
            params: userRequest,
            headers: {
              authorization: context.get('authorization') || 'Bearer ',
              usertoken: context.get('usertoken'),
              'x-session-traceid': context.get('sessionTraceId'),
              'x-request-traceid': context.get('requestTraceId'),
            },
            proxy: false,
          })
          .then((resp: AxiosResponse) => {
            cache.set(cache.CacheKeySpace.USER, cacheKey, JSON.stringify(resp?.data));
            resolve(resp?.data);
          })
          .catch(reject);
      }
    });
  });
};
