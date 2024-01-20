import TOML from '@iarna/toml';
import { Log, LogLevel, Miniflare } from 'miniflare';

let platform: App.Platform;

export async function setupPlatform(): Promise<App.Platform> {
  if (platform) {
    return platform;
  }

  const fs = await import('fs');
  const tomlText = fs.readFileSync('wrangler.toml', 'utf8');
  const toml: {
    kv_namespaces?: { binding: string; id: string; preview_id: string }[];
    d1_databases?: { binding: string; database_name: string; database_id: string; preview_database_id: string }[];
    compatibility_date?: string;
  } = TOML.parse(tomlText) as never;

  const kvs = Object.fromEntries((toml.kv_namespaces || []).map(d => [d.binding, d.id]));
  const dbs = Object.fromEntries(
    (toml.d1_databases || []).map(d => [d.binding, d.preview_database_id ?? d.database_id])
  );

  const root = '../../.wrangler/v3';
  const mf = new Miniflare({
    log: new Log(LogLevel.WARN),
    modules: true,
    script: '',
    d1Databases: dbs,
    kvNamespaces: kvs,
    kvPersist: `${root}/kv`,
    d1Persist: `${root}/d1`,
    compatibilityDate: toml.compatibility_date
  });

  platform = {
    env: await mf.getBindings(),
    context: {},
    caches: {},
    cf: {}
  } as App.Platform;

  try {
    // Mini-flare caches a cf.json, loaded from https://workers.cloudflare.com/cf.json
    const cfText = fs.readFileSync('node_modules/.mf/cf.json', 'utf8');
    platform.cf = JSON.parse(cfText);
  } catch (err) {
    console.log(err);
  }

  // TODO: Also setup
  // context: {
  // 	waitUntil(promise: Promise<any>): void;
  // };
  // caches: CacheStorage & { default: Cache }

  return platform;
}
