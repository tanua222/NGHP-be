import { Jwt } from 'jsonwebtoken';
import { Error } from '../../domain/dto/response.dto';
import { IdentityProviderDomainDetails } from '../../utils/app-config';
import Context from '../../utils/context';
const jwksClient = require('jwks-rsa');

/**
 * JWK Client instances for caching JWK responses
 */
const clients = new Map();
const kidToPublicKeyMap = new Map();

/**
 * Fetch JWK RSA public key appropriate for {@param decodedToken}
 *
 * @param {*} decodedToken  decoded jwt token.
 * @param {*} tokenType     ACCESS_TOKEN || ID_TOKEN
 */
export const getKey = (
  context: Context,
  decodedToken: Jwt,
  tokenType: string,
  identityProviderDomain: IdentityProviderDomainDetails
) =>
  new Promise((resolve, reject) => {
    if (kidToPublicKeyMap.has(decodedToken.header.kid)) {
      return resolve(kidToPublicKeyMap.get(decodedToken.header.kid));
    }

    const tokenClientKey = tokenType + identityProviderDomain.apis.jwksAccessToken.endPoint;

    if (!clients.has(tokenClientKey)) {
      clients.set(
        tokenClientKey,
        jwksClient({
          cache: true,
          rateLimit: true,
          // // Default value -- check if we should increase it
          jwksRequestsPerMinute: identityProviderDomain.jwksRequestsPerMinute,
          jwksUri: identityProviderDomain.apis.jwksAccessToken.endPoint,
          proxy: false
        })
      );
    }

    clients.get(tokenClientKey).getSigningKey(decodedToken.header.kid, (err: any, jwk: any) => {
      if (err || !jwk) {
        return reject(Error.unAuthorizedTokenKeyError(err));
      } else {
        const publicKey = jwk.publicKey || jwk.rsaPublicKey;
        kidToPublicKeyMap.set(decodedToken.header.kid, publicKey);
        return resolve(kidToPublicKeyMap.get(decodedToken.header.kid));
      }
    });
  });
