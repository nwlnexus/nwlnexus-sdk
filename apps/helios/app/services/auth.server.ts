import { findOrCreateAuthAccount } from '@services/db.server';
import { findOrCreateUser } from '@db/users.server';
import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';
import type { AppLoadContext, SessionStorage } from '@remix-run/cloudflare';
import type { profiles } from '@nwlnexus/db-schema/schema';

type UserProfile = typeof profiles.$inferSelect;

const getAuthenticator = async (context: AppLoadContext, sessionStorage: SessionStorage) => {
  const authConfig = {
    callbackURL: context.env.AUTH_AUTH0_CALLBACK_URL,
    clientID: context.env.AUTH_AUTH0_ID,
    clientSecret: context.env.AUTH_AUTH0_SECRET,
    domain: context.env.AUTH_AUTH0_DOMAIN
  };

  const auth0Strategy = new Auth0Strategy(authConfig, async ({ accessToken, profile }) => {
    const userProfile = await findOrCreateUser({ db: context.env.DB, profile });
    await findOrCreateAuthAccount({ userId: userProfile.id, db: context.env.DB, profile, accessToken });
    return userProfile;
  });
  const authenticator = new Authenticator<UserProfile>(sessionStorage, { throwOnError: true });
  authenticator.use(auth0Strategy);
  return authenticator;
};

export { type UserProfile, getAuthenticator };
