// noinspection UnnecessaryLocalVariableJS

import type { Handle } from '@sveltejs/kit';

import { SvelteKitAuth } from '@auth/sveltekit';
import Auth0Provider from '@auth/sveltekit/providers/auth0';

export const handle = SvelteKitAuth(async event => {
  const authOptions = {
    providers: [
      Auth0Provider({
        clientId: event.platform?.env.AUTH_AUTH0_ID,
        clientSecret: event.platform?.env.AUTH_AUTH0_SECRET
      })
    ],
    secret: event.platform?.env.AUTH_SECRET,
    trustHost: true
  };
  return authOptions;
}) satisfies Handle;
