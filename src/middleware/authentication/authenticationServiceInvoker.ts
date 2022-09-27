import { IdentityProviderDomainDetails } from '../../utils/app-config';
import { AxiosInstance } from 'axios';
const axios = require('axios');

const axiosInstances: Map<string, AxiosInstance> = new Map();

const confiuredTimeOut = 120000;

function getAxiosInstance(baseUrl: string) {
  let instance = axios.create({
    baseURL: baseUrl,
    timeout: confiuredTimeOut,
    proxy: false,
  });

  return instance;
}

export function getAxiosInstanceForToken(identityProviderDomain: IdentityProviderDomainDetails) {
  const key = identityProviderDomain.name + 'token';
  if (!axiosInstances.get(key)) {
    axiosInstances.set(key, getAxiosInstance(identityProviderDomain.apis.token.endPoint));
  }
  return axiosInstances.get(key)!;
}
