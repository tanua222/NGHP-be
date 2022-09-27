import { AppConfig } from '../utils/app-config';
import Context from '../utils/context';
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const fs = require('fs');
const config = <AppConfig>require('config');

passport.serializeUser(function (user: any, done: any) {
  done(null, user);
});

passport.deserializeUser(function (user: any, done: any) {
  done(null, user);
});

const sso = config.ssoConfig;
const samlStrategy = new SamlStrategy(
  {
    callbackUrl: sso.callBackUrl,
    entryPoint: sso.ssoUrl,
    logoutUrl: sso.sloUrl,
    issuer: sso.issuer,
    identifierFormat: null,
    privateCert: {
      //* https://www.samltool.com/self_signed_certs.php *//
      // key: fs.readFileSync('./src/middleware/cert/privatekey.pem', 'utf-8'),
      passphrase: process.env.JWT_SESSION_SECRET,
    },
    // forceAuthn: false,
    // authnRequestBinding: 'HTTP-POST',
    // disableRequestedAuthnContext: true,
    // digestAlgorithm:'sha512',
    //skipRequestCompression: true,
    //additionalLogoutParams:  ,
    //logoutCallbackUrl: ,
  },
  (profile: any, done: any) => {
    /*
     * This method is called upon successful authentication
     * Here, the complete user profile can be fetched from application storage
     * It is then passed to the "done" function for PassportJS to store it in req.user
     */

    //  context.log.debug(`Profile :  ${profile}`);
    // context.log.debug(`Profile Roles: ${profile.role}`);

    let user = {
      roles: profile.role, //array of roles from PermIT
      userId: profile.nameID,
    };

    passport.user = user;
    console.log(`PROFILE: ${JSON.stringify(profile)}`);
    passport.profile = profile;

    //TODO find userID from the DB and set to cookies
    //  if(!userService.findByFilters({"loginUserName": profile.nameID})){
    //     context.log.debug(`invalid user: ${profile.nameID}`);
    //    return done(null, false,{message: `invalid user: ${profile.nameID}`});
    //  }

    return done(null, profile);
  }
);

passport.use(samlStrategy);

export let checkAuthentication = async (req: any, res: any, next: any) => {
  const context: Context = res.locals.context;
  context.log.debug(`isAuthenticated: ${passport.isAuthenticated}`);
  context.log.debug(`Environment: ${process.env.NODE_ENV}`);
  context.log.debug(`BypassSSO: ${process.env.BYPASS_SSO}`);
  if (passport.isAuthenticated || (process.env.BYPASS_SSO == 'true' && process.env.NODE_ENV != 'production')) {
    next();
  } else {
    res.redirect(sso.loginUrl); //redirect to /user/login
  }
};

export default passport;
