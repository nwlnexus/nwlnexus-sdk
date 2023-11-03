import { redirect } from '@remix-run/cloudflare';

// import { getAuthenticator } from '~/lib/services/auth0.server';
// import { appSessionStorage } from '~/lib/services/session.server';
// import type { ActionFunctionArgs } from '@remix-run/cloudflare';
// import type { SessionConfig } from '~/lib/services/session.server';

export const loader = () => redirect('/login');

// export const action = async ({ context, request }: ActionFunctionArgs) => {
//   const sessionConfig: SessionConfig = {
//     tag: '__olympus_net_session',
//     kv: context.env.KV,
//     secrets: context.env.SESSION_SECRET.split(','),
//     node_env: context.env.NODE_ENV
//   };
//   console.log('Callback URl', context.env.AUTH0_CALLBACK_URL);
//   const { sessionStorage } = await appSessionStorage(sessionConfig);
//   const authenticator = await getAuthenticator(context, sessionStorage);
//   return authenticator.authenticate('auth0', request);
// };
