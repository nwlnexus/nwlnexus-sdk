import authConfig from '@/app/auth/auth.config';
import NextAuth from 'next-auth';

export const { auth: middleware } = NextAuth(authConfig);
