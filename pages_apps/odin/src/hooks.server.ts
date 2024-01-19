// noinspection UnnecessaryLocalVariableJS

import type { Handle } from '@sveltejs/kit';

import { SvelteKitAuth } from '@auth/sveltekit';
import Auth0Provider from '@auth/sveltekit/providers/auth0';
import {
  AUTH_AUTH0_ID,
  AUTH_AUTH0_SECRET,
  AUTH_SECRET
  // @ts-expect-error Unsure why
} from '$env/static/private';

export const handle = SvelteKitAuth(async () => {
  const authOptions = {
    providers: [
      Auth0Provider({
        clientId: AUTH_AUTH0_ID,
        clientSecret: AUTH_AUTH0_SECRET
      })
    ],
    secret: AUTH_SECRET,
    trustHost: true
  };
  return authOptions;
}) satisfies Handle;
