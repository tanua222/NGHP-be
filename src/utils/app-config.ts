export interface AppConfig {
  server: ServerConfig;
  log: LogConfig;
  dbConfig: DbDetailsConfig;
  ssoConfig: SsoConfig;
  pagination: PaginationConfig;
  dbDateTimeZoneConfig: DbDateTimeZoneConfig;
  oasValidation: OasValidation;
  remoteCache: RemoteCache;
  applicationApi: Map<string, ApplicationApiConfig>;
  callingApplication: Map<string, CallingApplicationConfig>;
  authentication: AuthenticationDetails;
  kongNpEnv: string;
  hierarchyExtract:{columns:string[]};
  enableQueryTime:EnableQueryTime;
}

export interface AuthenticationDetails {
  enabled: boolean;
  kongId: string;
  clientId: string;
  clientSecret: string;
  identityProviderDomains: IdentityProviderDomain;
}
export interface ApplicationApiConfig {
  baseUrl: string;
  authorization: ApiAuthorizationConfig;
}
export interface ApiAuthorizationConfig {
  grant_type: string;
  scope: string;
}
export interface IdentityProviderDomain {
  teamMember: IdentityProviderDomainDetails;
  customer: IdentityProviderDomainDetails;
  partner: IdentityProviderDomainDetails;
}
export interface IdentityProviderDomainDetails {
  name: string;
  enabled: boolean;
  allowedScopes: string[];
  tokenTTL: number;
  issuer: string;
  audience: string;
  apis: AuthenticationApi;
  redirectUrl: string;
  jwksRequestsPerMinute: number;
}

export interface AuthenticationApi {
  token: AuthenticationApiDetails;
  jwksAccessToken: AuthenticationApiDetails;
}
export interface CallingApplicationConfig {
  clientId: string;
}
export interface AuthenticationApiDetails {
  endPoint: string;
}
export interface SsoConfig {
  bypassSso: boolean;
  ssoUrl: string;
  sloUrl: string;
  callBackUrl: string;
  loginUrl: string;
  issuer: string;
}

export interface EnableQueryTime{
  enableQueryTime:boolean;
}

interface ServerConfig {
  contextPath: string;
  port: number;
}

interface LogConfig {
  level: string;
}

interface DbDetailsConfig {
  cerptAdmin: DbConnectionDetails;
}

interface DbConnectionDetails {
  enabled: boolean;
  user: string;
  connectString: string;
  poolAlias: string;
  poolIncrement: number;
  poolMax: number;
  poolMin: number;
  poolTimeout: number;
  drainTime: number;
  poolPingInterval: number;
  enableStatistics: boolean;
}

interface RemoteCache {
  enabled: boolean;
  host: string;
  port: number;
}

interface DbDateTimeZoneConfig {
  dbTimeZoneName: string;
  // enabled: boolean | false;
  // dbTimeZone: string;
  // inputTimeZone: string;
}

interface PaginationConfig {
  defaultOffset: number;
  defaultLimit: number;
}

interface OasValidation {
  validateRequest: boolean;
  validateResponse: boolean;
}
