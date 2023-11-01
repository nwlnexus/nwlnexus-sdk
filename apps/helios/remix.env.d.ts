/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />
/// <reference types="@cloudflare/workers-types" />

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext {
    env: {
      DB: D1Database;
      KV: KVNamespace;
      WEATHERAPI_KEY: string;
      SESSION_SECRET: string;
      NODE_ENV: string;
      AUTH0_CALLBACK_URL: string;
      AUTH0_CLIENT_ID: string;
      AUTH0_CLIENT_SECRET: string;
      AUTH0_DOMAIN: string;
    };
  }
}
