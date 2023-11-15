import { D1Adapter } from '@auth/d1-adapter';
import NextAuth from 'next-auth';
import authConfig from './auth.config';

export const { handlers, auth } = NextAuth({
  adapter: D1Adapter(process.env.DB),
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  ...authConfig
});
