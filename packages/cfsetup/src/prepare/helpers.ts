import type { D1Result } from '@cloudflare/workers-types/experimental';
import type { Config, ConfigFields, DevConfig, Environment } from '../config';
import type { Database, Migration, QueryResult } from './types';

import assert from 'node:assert';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'path';
import { Miniflare } from 'miniflare';

import { confirm } from '../dialogs';
import { CI } from '../is-ci';
import isInteractive from '../is-interactive';
import { logger } from '../logger';
import { readFileSync } from '../parse';
import { readableRelative } from '../paths';
import { DEFAULT_MIGRATION_PATH, DEFAULT_MIGRATION_TABLE, MF_D1_PREFIX } from './constants';
import splitSqlQuery from './splitter';

export async function getMigrationsPath({
  projectPath,
  migrationsFolderPath,
  createIfMissing
}: {
  projectPath: string;
  migrationsFolderPath: string;
  createIfMissing: boolean;
}): Promise<string> {
  const dir = path.resolve(projectPath, migrationsFolderPath);
  if (fs.existsSync(dir)) return dir;

  const warning = `No migrations folder found.${
    migrationsFolderPath === DEFAULT_MIGRATION_PATH
      ? ' Set `migrations_dir` in wrangler.toml to choose a different path.'
      : ''
  }`;

  if (createIfMissing && (await confirm(`${warning}\nOk to create ${dir}?`))) {
    fs.mkdirSync(dir, { recursive: true });
    return dir;
  } else {
    logger.warn(warning);
  }

  throw new Error(`No migrations present at ${dir}.`);
}

export async function getUnappliedMigrations({
  migrationsTableName,
  migrationsPath,
  wranglerConfig,
  name,
  persistTo
}: {
  migrationsTableName: string;
  migrationsPath: string;
  wranglerConfig: ConfigFields<DevConfig> & Environment;
  name: string;
  persistTo: string;
}): Promise<Array<string>> {
  const appliedMigrations = (await listAppliedMigrations(migrationsTableName, wranglerConfig, name, persistTo)).map(
    migration => {
      return migration.name;
    }
  );
  const projectMigrations = getMigrationNames(migrationsPath);

  const unappliedMigrations: Array<string> = [];

  for (const migration of projectMigrations) {
    if (!appliedMigrations.includes(migration)) {
      unappliedMigrations.push(migration);
    }
  }

  return unappliedMigrations;
}

const listAppliedMigrations = async (
  migrationsTableName: string,
  wranglerConfig: ConfigFields<DevConfig> & Environment,
  name: string,
  persistTo: string
): Promise<Migration[]> => {
  const response: QueryResult[] | null = await executeSql({
    wranglerConfig,
    name,
    shouldPrompt: isInteractive() && !CI.isCI(),
    persistTo,
    command: `SELECT *
		FROM ${migrationsTableName}
		ORDER BY id`,
    file: undefined,
    json: true
  });

  if (!response || response[0].results.length === 0) return [];

  return response[0].results as Migration[];
};

function getMigrationNames(migrationsPath: string): Array<string> {
  const migrations = [];

  const dir = fs.opendirSync(migrationsPath);

  let dirent;
  while ((dirent = dir.readSync()) !== null) {
    if (dirent.name.endsWith('.sql')) migrations.push(dirent.name);
  }

  dir.closeSync();

  return migrations;
}

export function getNextMigrationNumber(migrationsPath: string): number {
  let highestMigrationNumber = -1;

  for (const migration in getMigrationNames(migrationsPath)) {
    const migrationNumber = parseInt(migration.split('_')[0]);

    if (migrationNumber > highestMigrationNumber) {
      highestMigrationNumber = migrationNumber;
    }
  }

  return highestMigrationNumber + 1;
}

export const initMigrationsTable = async ({
  migrationsTableName,
  wranglerConfig,
  name,
  persistTo
}: {
  migrationsTableName: string;
  wranglerConfig: ConfigFields<DevConfig> & Environment;
  name: string;
  persistTo: string;
}) => {
  return executeSql({
    wranglerConfig,
    name,
    shouldPrompt: isInteractive() && !CI.isCI(),
    persistTo,
    command: `CREATE TABLE IF NOT EXISTS ${migrationsTableName}(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);`,
    file: undefined,
    json: true
  });
};

export async function executeSql({
  wranglerConfig,
  name,
  persistTo,
  file,
  command,
  json
}: {
  wranglerConfig: ConfigFields<DevConfig> & Environment;
  name: string;
  shouldPrompt: boolean | undefined;
  persistTo: string;
  file: string | undefined;
  command: string | undefined;
  json: boolean | undefined;
}) {
  const existingLogLevel = logger.loggerLevel;
  if (json) {
    // set loggerLevel to error to avoid logs appearing in JSON output
    logger.loggerLevel = 'error';
  }
  const sql = file ? readFileSync(file) : command;
  if (!sql) throw new Error(`Error: must provide --command or --file.`);
  logger.log(`🌀 Mapping SQL input into an array of statements`);
  const queries = splitSqlQuery(sql);

  if (file && sql) {
    if (queries[0].startsWith('SQLite format 3')) {
      //TODO: update this error to recommend using `wrangler d1 restore` when it exists
      throw new Error(
        'Provided file is a binary SQLite database file instead of an SQL text file.\nThe execute command can only process SQL text files.\nPlease export an SQL file from your SQLite database and try again.'
      );
    }
  }
  const result = await executeLocally({
    wranglerConfig,
    name,
    queries,
    persistTo
  });
  console.log(result);
  if (json) logger.loggerLevel = existingLogLevel;
  return result;
}

async function executeLocally({
  wranglerConfig,
  name,
  queries,
  persistTo
}: {
  wranglerConfig: Config;
  name: string;
  queries: string[];
  persistTo: string;
}) {
  const localDB = getDatabaseInfoFromConfig(wranglerConfig, name);
  if (!localDB) {
    throw new Error(`Can't find a DB with name/binding '${name}' in local config. Check info in wrangler.toml...`);
  }

  const id = localDB.previewDatabaseUuid ?? localDB.uuid;
  const d1Persist = persistTo;
  // const d1Persist = getPersistencePath(persistTo, 'd1') as string;
  console.log(`🌀 Executing on local database ${name} (${id}) from ${readableRelative(d1Persist)}:`);

  logger.log(`🌀 Executing on local database ${name} (${id}) from ${readableRelative(d1Persist)}:`);

  const mf = new Miniflare({
    modules: true,
    script: '',
    d1Persist,
    d1Databases: { DATABASE: id }
  });
  const db = await mf.getD1Database('DATABASE');

  let results: D1Result<Record<string, string | number | boolean>>[];
  try {
    results = await db.batch(queries.map(query => db.prepare(query)));
  } catch (e: unknown) {
    throw (e as { cause?: unknown })?.cause ?? e;
  } finally {
    await mf.dispose();
  }
  assert(Array.isArray(results));
  return results.map<QueryResult>(result => ({
    results: (result.results ?? []).map(row =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => {
          if (Array.isArray(value)) value = `[${value.join(', ')}]`;
          if (value === null) value = 'null';
          return [key, value];
        })
      )
    ),
    success: result.success,
    meta: { duration: result.meta?.duration }
  }));
}

export function getDatabaseInfoFromConfig(wranglerConfig: Config, name: string): Database | null {
  for (const d1Database of wranglerConfig.d1_databases) {
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

export function getPersistencePath(persistTo: string, medium: 'd1' | 'r2' | 'kv', others?: string[]) {
  return typeof others == 'undefined'
    ? path.join(persistTo, 'v3', medium)
    : [...others, path.join(persistTo, 'v3', medium)];
}

export function getDatabasePersistencePath(persistTo: string, dbFileName: string) {
  return path.join(getPersistencePath(persistTo, 'd1') as string, MF_D1_PREFIX, dbFileName);
}

export function durableObjectNamespaceIdFromName(uniqueKey: string, name: string) {
  const key = crypto.createHash('sha256').update(uniqueKey).digest();
  const nameHmac = crypto.createHmac('sha256', key).update(name).digest().subarray(0, 16);
  const hmac = crypto.createHmac('sha256', key).update(nameHmac).digest().subarray(0, 16);
  return Buffer.concat([nameHmac, hmac]).toString('hex');
}
