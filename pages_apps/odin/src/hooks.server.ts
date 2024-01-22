import type { Handle } from '@sveltejs/kit';

import { SvelteKitAuth } from '@auth/sveltekit';
import Auth0Provider from '@auth/sveltekit/providers/auth0';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';
import {
  AUTH_AUTH0_DOMAIN,
  AUTH_AUTH0_ID,
  AUTH_AUTH0_SECRET,
  AUTH_SECRET
  // @ts-expect-error Unsure why
} from '$env/static/private';

const cfDevShim = (async ({ event, resolve }) => {
  if (dev && !event.platform) {
    const mf = await import('./lib/server/miniflare');
    event.platform = await mf.setupPlatform();
  }
  return resolve(event);
}) satisfies Handle;

const authGuard = (async ({ event, resolve }) => {
  // const layoutId: RouteId;
  const session = await event.locals.getSession();
  const routeId = event.route.id;

  console.log('Route ID:', routeId);
  console.log('Session:', session);

  if (!session && routeId?.startsWith('/(app-ui)/')) {
    throw redirect(303, '/auth/signin');
  }
  return resolve(event);
}) satisfies Handle;

export const handle = sequence(
  cfDevShim,
  SvelteKitAuth({
    debug: true,
    providers: [
      Auth0Provider({
        clientId: AUTH_AUTH0_ID,
        clientSecret: AUTH_AUTH0_SECRET,
        issuer: 'https://' + AUTH_AUTH0_DOMAIN
      })
    ],
    secret: AUTH_SECRET,
    trustHost: true
  }),
  authGuard
);
