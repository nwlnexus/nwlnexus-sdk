import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import getServerSession from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import type { NextAuthConfig } from 'next-auth';

export const config = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH_AUTH0_ID!,
      clientSecret: process.env.AUTH_AUTH0_SECRET!,
      issuer: process.env.AUTH_AUTH0_DOMAIN
    })
  ]
} satisfies NextAuthConfig;

export function auth(
  ...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []
) {
  return getServerSession(...args, config);
}
