// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Platform {
      env: {
        OLYMPUS_DB: D1Database;
        OLYMPUS_KV: KVNamespace;
        WEATHERAPI_KEY: string;
        AUTH_AUTH0_ID: string;
        AUTH_AUTH0_SECRET: string;
        AUTH_AUTH0_DOMAIN: string;
        AUTH_SECRET: string;
        NODE_ENV: string;
        APP_VERSION: string;
      };
      context: {
        waitUntil(promise: Promise<never>): void;
      };
      caches: CacheStorage & { default: Cache };
    }
  }
}

export {};
