import type { Config } from '../config';
import type { Database as D1Database } from './types';

import child_process from 'node:child_process';
import crypto from 'node:crypto';
import path from 'node:path';
import Database from 'better-sqlite3';
import chalk from 'chalk';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { yellow } from '../colors';
import { resetCFAssets } from '../reset';
import { DEFAULT_MIGRATION_PATH, DEFAULT_MIGRATION_TABLE } from './constants';

export function getDatabaseInfoFromConfig(config: Config, name: string): D1Database | null {
  for (const d1Database of config.d1_databases) {
    if (d1Database.database_id && (name === d1Database.database_name || name === d1Database.binding)) {
      return {
        uuid: d1Database.database_id,
        previewDatabaseUuid: d1Database.preview_database_id,
        binding: d1Database.binding,
        name: d1Database.database_name,
        migrationsTableName: d1Database.migrations_table || DEFAULT_MIGRATION_TABLE,
        migrationsFolderPath: d1Database.migrations_dir || DEFAULT_MIGRATION_PATH,
        internal_env: d1Database.database_internal_env
      };
    }
  }
  return null;
}

export const handleD1 = async (
  d1_databases: Config['d1_databases'],
  schemaDir: string,
  persistTo: string,
  reset?: boolean
) => {
  const persistencePath = path.join(persistTo, 'v3', 'd1');
  if (d1_databases && d1_databases.length > 0) {
    for (const database of d1_databases) {
      const mDir = database.migrations_dir ?? DEFAULT_MIGRATION_PATH;
      if (reset) {
        resetCFAssets(mDir);
        resetCFAssets(persistencePath);
      }

      console.info(chalk.blue(`Preparing to setup D1 Database: ${database.binding}`));
      const mfD1Prefix = 'miniflare-D1DatabaseObject';
      const hashedBindingPath = durableObjectNamespaceIdFromName(mfD1Prefix, database.binding);

      // const schema = path.normalize(schemaDir);
      // const outDir = path.normalize(`${migrationsDir}`);
      console.info(chalk.blue(`Preparing generate SQL...`));
      const genSQLCmd = `drizzle-kit generate:sqlite --schema=${schemaDir} --out=${mDir}`;
      child_process.execSync(genSQLCmd, {
        stdio: 'inherit',
        encoding: 'utf8'
      });
      console.info(chalk.blue(`Preparing to apply SQL...`));
      console.info(chalk.blue(`Handling DB operations...`));
      const dbPath = path.join(persistencePath, 'miniflare-D1DatabaseObject', `${hashedBindingPath}.sqlite`);
      const betterSqlite = new Database(dbPath);
      console.log(betterSqlite.name);
      betterSqlite.pragma('table_list');
      const db = drizzle(betterSqlite);
      console.log(db);
      migrate(db, { migrationsFolder: mDir, migrationsTable: DEFAULT_MIGRATION_TABLE });
      // const wranglerCmd = `NO_D1_WARNING=true wrangler d1 migrations apply ${database.binding} --local --persist-to=${persistTo}`;
      // child_process.execSync(wranglerCmd, {
      //   stdio: 'inherit',
      //   encoding: 'utf8'
      // });
      console.info(chalk.blue(`Completed setup of D1 Database: ${database.binding}`));
    }
  } else {
    console.info(yellow(`Skipping D1 setup. --d1 not specified or no d1_databases defined in wrangler.toml`));
  }
};

export const handleKV = async (kv_namespaces: Config['kv_namespaces'], persistTo: string, reset?: boolean) => {
  if (kv_namespaces && kv_namespaces.length > 0) {
    for (const kv of kv_namespaces) {
      if (reset) {
        resetCFAssets(path.join(persistTo, 'v3', 'kv'));
      }
      console.info(chalk.blue(`Preparing to setup KV: ${kv.binding}`));
    }
  } else {
    console.info(yellow(`Skipping KV setup. --kv not specified or no kv_namespaces defined in wrangler.toml`));
  }
};

export const handleR2 = async (r2_buckets: Config['r2_buckets'], persistTo: string, reset?: boolean) => {
  if (r2_buckets && r2_buckets.length > 0) {
    for (const r2_bucket of r2_buckets) {
      if (reset) {
        resetCFAssets(path.join(persistTo, 'v3', 'r2'));
      }
      console.info(chalk.blue(`Preparing to setup R2: ${r2_bucket.binding}`));
    }
  } else {
    console.info(yellow(`Skipping R2 setup. --r2 not specified or no r2_buckets defined in wrangler.toml`));
  }
};

function durableObjectNamespaceIdFromName(uniqueKey: string, name: string) {
  const key = crypto.createHash('sha256').update(uniqueKey).digest();
  const nameHmac = crypto.createHmac('sha256', key).update(name).digest().subarray(0, 16);
  const hmac = crypto.createHmac('sha256', key).update(nameHmac).digest().subarray(0, 16);
  return Buffer.concat([nameHmac, hmac]).toString('hex');
}
