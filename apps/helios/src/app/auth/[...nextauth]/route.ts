import { config } from 'auth';
import NextAuth from 'next-auth';

export const runtime = 'edge';
const { handlers } = NextAuth(config);
export const { GET, POST } = handlers;
