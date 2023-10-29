/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />
/// <reference types="@cloudflare/workers-types" />

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext {
    env: {
      WEATHERAPI_KEY: string;
      SESSION_SECRET: string;
      NODE_ENV: string;
    };
  }
}
