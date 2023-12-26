import type { UserProfile } from '@services/db.server';
import { findOrCreateProfile } from '@services/db.server';
import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';
import type { AppLoadContext, SessionStorage } from '@remix-run/cloudflare';

const getAuthenticator = async (context: AppLoadContext, sessionStorage: SessionStorage) => {
  const authConfig = {
    callbackURL: context.env.AUTH_AUTH0_CALLBACK_URL,
    clientID: context.env.AUTH_AUTH0_ID,
    clientSecret: context.env.AUTH_AUTH0_SECRET,
    domain: context.env.AUTH_AUTH0_DOMAIN
  };

  const auth0Strategy = new Auth0Strategy(authConfig, async ({ profile }) => {
    const userProfile = await findOrCreateProfile({ db: context.env.DB, profile });
    return userProfile;
  });
  const authenticator = new Authenticator<UserProfile>(sessionStorage, { throwOnError: true });
  authenticator.use(auth0Strategy);
  return authenticator;
};

export { type UserProfile, getAuthenticator };
