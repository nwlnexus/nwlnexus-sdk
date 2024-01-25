// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Session } from '@auth/sveltekit';

declare global {
  namespace App {
    interface Locals {
      session: Session | null;
    }
    interface Platform {
      env: {
        OLYMPUS_DB: D1Database;
        OLYMPUS_KV: KVNamespace;
      };
      context: {
        waitUntil(promise: Promise<never>): void;
      };
      caches: CacheStorage & { default: Cache };
      cf: {};
    }
  }
}

export {};
