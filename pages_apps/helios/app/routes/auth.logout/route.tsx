import { redirect } from '@remix-run/cloudflare';
import { appConfig } from '@config/app.config';
import { appSessionStorage } from '@services/sessions.server';
import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import type { SessionConfig } from '@services/sessions.server';

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const sessionConfig: SessionConfig = {
    kv: context.env.KV,
    node_env: context.env.NODE_ENV,
    secrets: context.env.AUTH_SECRET.split(','),
    tag: appConfig.cookieTag
  };
  const sessionStorage = await appSessionStorage(sessionConfig);
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  const logoutURL = new URL('https://' + context.env.AUTH_AUTH0_DOMAIN + '/v2/logout');

  logoutURL.searchParams.set('client_id', context.env.AUTH_AUTH0_ID);
  logoutURL.searchParams.set('returnTo', context.env.AUTH_AUTH0_RETURN_TO_URL);

  return redirect(logoutURL.toString(), {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  });
};
