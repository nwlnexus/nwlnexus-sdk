// import { getAuthenticator } from '~/lib/services/auth0.server';
// import { appSessionStorage } from '~/lib/services/session.server';
// import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
// import type { SessionConfig } from '~/lib/services/session.server';
//
// export const loader = async ({ context, request }: LoaderFunctionArgs) => {
//   const sessionConfig: SessionConfig = {
//     tag: '__olympus_net_session',
//     kv: context.env.KV,
//     secrets: context.env.SESSION_SECRET.split(','),
//     node_env: context.env.NODE_ENV
//   };
//   const { sessionStorage } = await appSessionStorage(sessionConfig);
//   const authenticator = await getAuthenticator(context, sessionStorage);
//   return authenticator.authenticate('auth0', request, {
//     successRedirect: '/dashboard',
//     failureRedirect: '/login'
//   });
// };
