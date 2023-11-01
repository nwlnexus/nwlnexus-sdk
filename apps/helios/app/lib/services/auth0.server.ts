import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';
import type { AppLoadContext, SessionStorage } from '@remix-run/cloudflare';
import type { Auth0ExtraParams, Auth0Profile } from 'remix-auth-auth0';

const getAuthenticator = async (context: AppLoadContext, sessionStorage: SessionStorage) => {
  const authConfig = {
    callbackURL: context.env.AUTH0_CALLBACK_URL,
    clientID: context.env.AUTH0_CLIENT_ID,
    clientSecret: context.env.AUTH0_CLIENT_SECRET,
    domain: context.env.AUTH0_DOMAIN
  };

  let microsoftStrategy = new Auth0Strategy(authConfig, async ({ accessToken, refreshToken, extraParams, profile }) => {
    return { accessToken, refreshToken, extraParams, profile };
  });
  const authenticator = new Authenticator<{
    accessToken: string;
    refreshToken: string | undefined;
    extraParams: Auth0ExtraParams;
    profile: Auth0Profile;
  }>(sessionStorage);
  authenticator.use(microsoftStrategy);

  return authenticator;
};

export { getAuthenticator };
