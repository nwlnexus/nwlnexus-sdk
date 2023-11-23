import { findOrCreateAccount } from '~/db/accounts.server';
import { findOrCreateUser } from '~/db/users.server';
import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';
import type { AppLoadContext, SessionStorage } from '@remix-run/cloudflare';
import type { users } from '~/db/schema/db';

type UserProfile = Pick<typeof users.$inferSelect, 'id' | 'name' | 'email' | 'emailVerified'> & { accessToken: string };

const getAuthenticator = async (context: AppLoadContext, sessionStorage: SessionStorage) => {
  const authConfig = {
    callbackURL: context.env.AUTH_AUTH0_CALLBACK_URL,
    clientID: context.env.AUTH_AUTH0_ID,
    clientSecret: context.env.AUTH_AUTH0_SECRET,
    domain: context.env.AUTH_AUTH0_DOMAIN
  };

  const auth0Strategy = new Auth0Strategy(authConfig, async ({ accessToken, refreshToken, profile }) => {
    const user = await findOrCreateUser({ db: context.env.DB, profile });
    await findOrCreateAccount({ userId: user.id, db: context.env.DB, profile, accessToken });
    return { id: user.id, name: user.name, email: user.email, emailVerified: user.emailVerified, accessToken };
  });
  const authenticator = new Authenticator<UserProfile>(sessionStorage, { throwOnError: true });
  authenticator.use(auth0Strategy);
  return authenticator;
};

export { type UserProfile, getAuthenticator };
