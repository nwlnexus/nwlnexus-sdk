/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare" />
/// <reference types="@cloudflare/workers-types" />
// noinspection JSAnnotator

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext {
    env: {
      DB: D1Database;
      KV: KVNamespace;
      WEATHERAPI_KEY: string;
      AUTH_AUTH0_ID: string;
      AUTH_AUTH0_SECRET: string;
      AUTH_AUTH0_DOMAIN: string;
      AUTH_AUTH0_CALLBACK_URL: string;
      AUTH_AUTH0_RETURN_TO_URL: string;
      AUTH_SECRET: string;
      NODE_ENV: string;
      APP_VERSION: string;
    };
  }
}
