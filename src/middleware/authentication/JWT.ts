import { Jwt, decode, verify } from 'jsonwebtoken';
import { AppConfig, IdentityProviderDomainDetails } from '../../utils/app-config';
import { Error } from '../../domain/dto/response.dto';
import Context from '../../utils/context';
import { getKey } from './JWKS';

const config = <AppConfig>require('config');

export function decodeToken(accessToken: string): Jwt {
  const jwt: Jwt = decode(accessToken, { complete: true })!;
  return jwt;
}

export async function verifyAccessToken(
  context: Context,
  token: string,
  tokenType: string,
  identityProviderDomain: IdentityProviderDomainDetails
) {
  const decodedToken = decodeToken(token);
  const publicKey = await getKey(context, decodedToken, tokenType, identityProviderDomain);
  await verifyToken(context, token, publicKey, {
    audience: identityProviderDomain.audience,
    issuer: identityProviderDomain.issuer,
  });
  await validateTokenScope(context, decodedToken, identityProviderDomain);
  return token;
}

/**
 * Verify jwt token
 *
 * @param {*} token   jwt token
 * @param {*} key     token key
 */
async function verifyToken(context: Context, token: string, key: any, options: any) {
  return new Promise<void>((resolve, reject) => {
    verify(token, key, options, (err: any) => {
      if (err) {
        reject(Error.unAuthorizedTokenInvalid(err));
      }
      resolve();
    });
  });
}

async function validateTokenScope(
  context: Context,
  decodedToken: Jwt,
  identityProviderDomain: IdentityProviderDomainDetails
) {
  const allowedScopePerConfig: string[] = identityProviderDomain.allowedScopes;
  const tokenScopes: string[] = decodedToken.payload.scope;
  // TODO : check if we want to make it a strict one
  // const validScopes = allowedScopePerConfig.every( ai => tokenScopes.includes(ai) );
  // Or we could do this tokenScopes.every(ai => allowedScopePerConfig.includes(ai));
  // This one is little bit less strict
  const validScopes = allowedScopePerConfig.some((ai) => tokenScopes.includes(ai));
  if (!validScopes) {
    context?.log.debug(
      'validateTokenScope failed with allowed scopes in config ',
      allowedScopePerConfig,
      ' not matching with token scopes ',
      tokenScopes
    );
    throw Error.unAuthorizedForThisScope(decodedToken.payload.scope);
  }
  return true;
}
