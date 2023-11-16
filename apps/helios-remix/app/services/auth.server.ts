import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';
import type { AppLoadContext, SessionStorage } from '@remix-run/cloudflare';

type UserProfile = {};

const getAuthenticator = async (context: AppLoadContext, sessionStorage: SessionStorage) => {
  const authConfig = {
    callbackURL: context.env.AUTH_AUTH0_CALLBACK_URL,
    clientID: context.env.AUTH_AUTH0_ID,
    clientSecret: context.env.AUTH_AUTH0_SECRET,
    domain: context.env.AUTH_AUTH0_DOMAIN
  };

  const auth0Strategy = new Auth0Strategy(authConfig, async ({ accessToken, extraParams, profile }) => {
    return { accessToken, extraParams, profile };
  });
  const authenticator = new Authenticator<UserProfile>(sessionStorage);
  authenticator.use(auth0Strategy);
  return authenticator;
};

export { type UserProfile, getAuthenticator };
