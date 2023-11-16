import { config as appConfig } from '~/config/app.config';
import { getAuthenticator } from '~/services/auth.server';
import { appSessionStorage } from '~/services/session.server';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import type { SessionConfig } from '~/services/session.server';

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const sessionConfig: SessionConfig = {
    kv: context.env.KV,
    node_env: context.env.NODE_ENV,
    secrets: context.env.AUTH_SECRET.split(','),
    tag: appConfig.cookieTag
  };
  const sessionStorage = await appSessionStorage(sessionConfig);
  const authenticator = await getAuthenticator(context, sessionStorage);

  return authenticator.authenticate('auth0', request, {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  });
};
