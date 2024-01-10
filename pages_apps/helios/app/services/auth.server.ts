import type { AppLoadContext, SessionStorage } from '@remix-run/cloudflare';
import type { UserProfile } from '@services/db.server';

import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';

import { findOrCreateProfile } from '@services/db.server';

const getAuthenticator = async (context: AppLoadContext, sessionStorage: SessionStorage) => {
  const authConfig = {
    callbackURL: context.env.AUTH_AUTH0_CALLBACK_URL,
    clientID: context.env.AUTH_AUTH0_ID,
    clientSecret: context.env.AUTH_AUTH0_SECRET,
    domain: context.env.AUTH_AUTH0_DOMAIN
  };

  const auth0Strategy = new Auth0Strategy(authConfig, async ({ profile }) => {
    return await findOrCreateProfile({
      d1DB: context.env.OLYMPUS_DB,
      profile,
      tenantId: context.env.AUTH_AUTH0_ID
    });
  });

  const authenticator = new Authenticator<UserProfile>(sessionStorage, { throwOnError: true });
  authenticator.use(auth0Strategy);
  return authenticator;
};

export { type UserProfile, getAuthenticator };
