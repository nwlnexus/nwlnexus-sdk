import Auth0Provider from '@auth/core/providers/auth0';
import { D1Adapter } from '@auth/d1-adapter';
import type { AuthConfig } from '@auth/core';

export const config = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH_AUTH0_ID!,
      clientSecret: process.env.AUTH_AUTH0_SECRET!,
      issuer: process.env.AUTH_AUTH0_DOMAIN
    })
  ],
  adapter: D1Adapter(process.env.DB),
  trustHost: true,
  secret: process.env.AUTH_SECRET
} satisfies AuthConfig;
