import { Auth } from '@auth/core';
import { config } from 'auth';

export const runtime = 'edge';

export async function GET(req: Request) {
  return await Auth(req, config);
}

export async function POST(req: Request) {
  return await Auth(req, config);
}
