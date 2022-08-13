/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="@sveltejs/kit" />
/// <reference types="@cloudflare/workers-types" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		cookies: Record<string, string>;
		session: import('./lib/types/helios').Session<SessionData>;
	}
	interface Platform {
		env: {
			CLOUDFLARE_ACCOUNT_ID: string;
			CLOUDFLARE_API_TOKEN: string;
			APP_DOMAIN: string;
			APP_ACCESS_ORG: string;
			APP_ACCESS_AUD: string;
			AUTH0_DOMAIN: string;
			AUTH0_CLIENT_ID: string;
		};
		context: {
			waitUntil(promise: Promise<any>): void;
		};
		caches: CacheStorage & { default: Cache };
	}
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface Session extends SessionData {}
	interface Stuff {
		navMenu: import('./lib/types/helios').NavMenu[];
		settingsMenu: import('./lib/types/helios').NavMenu[];
		pages: import('./lib/types/helios').NavMenu[];
	}
}
interface SessionData {
	uuid?: string | null;
	permission?: string;
	lang?: string;
	email?: string;
}
