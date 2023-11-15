import authConfig from '@/app/auth/auth.config';
import { handlers } from 'auth';

export const runtime = 'edge';

export const { GET, POST } = handlers;
