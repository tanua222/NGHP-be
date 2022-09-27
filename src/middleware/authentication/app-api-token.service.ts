import { AppConfig, IdentityProviderDomainDetails } from '../../utils/app-config';
import { getAxiosInstanceForToken } from './authenticationServiceInvoker';
const qs = require('querystring');

const config = <AppConfig>require('config');

class AppApiTokenService {
  tokenMap: Map<string, TokenInfo> = new Map();

  /**
   * Get token to connect to app api specified by connection id ( connection id name should be same as configured in config)
   * @param connectionId
   * @returns
   */
  async getToken(connectionId: string): Promise<string> {
    const identityProviderDomain: IdentityProviderDomainDetails =
      config.authentication.identityProviderDomains.teamMember;

    const tokenInfo = this.tokenMap.get(`systemAPI.${connectionId}`);
    if (tokenInfo && tokenInfo.expiry && tokenInfo.expiry > Date.now()) {
      return tokenInfo.token;
    }

    const options = config.applicationApi.get(connectionId)?.authorization;
    const kongUrl = identityProviderDomain.apis.token.endPoint;
    let basicCreds = Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET);
    let basicCredsB64 = basicCreds.toString('base64');

    try {
      const response = await getAxiosInstanceForToken(identityProviderDomain).post(
        kongUrl + '?' + qs.stringify(options),
        null,
        {
          headers: {
            Authorization: `Basic ${basicCredsB64}`,
          },
        }
      );

      let accessToken = response.data;
      let tokenObj: TokenInfo = {
        token: accessToken.access_token,
        expiry: Date.now() + accessToken.expires_in * 1000,
      };
      this.tokenMap.set(`systemAPI.${connectionId}`, tokenObj);
      return tokenObj.token;
    } catch (err) {
      throw err;
    }
  }
}

interface TokenInfo {
  token: string;
  expiry: number;
}

export default new AppApiTokenService();
