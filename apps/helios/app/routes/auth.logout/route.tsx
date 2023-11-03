// import { redirect } from '@remix-run/cloudflare';
// import { appSessionStorage } from '~/lib/services/session.server';
// import type { ActionFunctionArgs } from '@remix-run/cloudflare';
//
// export const loader = async () => {
//   return null;
// };
//
// export const action = async ({ context, request }: ActionFunctionArgs) => {
//   const { getSession, destroySession } = await appSessionStorage(context);
//   const session = await getSession(request.headers.get('Cookie'));
//   const logoutURL = new URL(`https://${context.env.AUTH0_DOMAIN}/v2/logout`);
//
//   logoutURL.searchParams.set('client_id', context.env.AUTH0_CLIENT_ID);
//   logoutURL.searchParams.set('returnTo', '/');
//
//   return redirect(logoutURL.toString(), {
//     headers: {
//       'Set-Cookie': await destroySession(session)
//     }
//   });
// };
