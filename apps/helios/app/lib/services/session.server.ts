import { createWorkersKVSessionStorage } from '@remix-run/cloudflare';

type SessionConfig = {
  tag?: string;
  secrets: string[];
  kv: KVNamespace;
  node_env: string;
};

const appSessionStorage = async ({ tag, secrets, kv, node_env }: SessionConfig) => {
  const sessionStorage = createWorkersKVSessionStorage({
    cookie: {
      name: tag ?? '__session', // use any name you want here
      sameSite: 'lax', // this helps with CSRF
      path: '/', // remember to add this so the cookie will work in all routes
      httpOnly: true, // for security reasons, make this cookie http only
      secrets, // replace this with an actual secret
      secure: node_env === 'production' // enable this in prod only
    },
    kv
  });

  const { getSession, commitSession, destroySession } = sessionStorage;

  return { sessionStorage, getSession, commitSession, destroySession };
};

export { type SessionConfig, appSessionStorage };
