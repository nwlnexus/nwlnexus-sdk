import type { Config } from '../config';

import child_process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@libsql/client';
import chalk from 'chalk';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

import { yellow } from '../colors';
import { logger } from '../logger';
import { resetCFAssets } from '../reset';
import { DEFAULT_MIGRATION_PATH, DEFAULT_MIGRATION_TABLE, MF_D1_PREFIX } from './constants';
import { durableObjectNamespaceIdFromName, getPersistencePath } from './helpers';

export const handleD1 = async (wranglerConfig: Config, schemaDir: string, persistTo: string, reset?: boolean) => {
  const d1_databases = wranglerConfig.d1_databases;
  logger.loggerLevel = 'info';
  if (d1_databases && d1_databases.length > 0) {
    for (const database of d1_databases) {
      const migrationsPath = database?.migrations_dir || DEFAULT_MIGRATION_PATH;
      if (reset) {
        resetCFAssets(getPersistencePath(persistTo, 'd1', [migrationsPath]));
      }

      logger.info(`Preparing to setup D1 Database: ${database.binding}`);
      const hashedBindingPath = durableObjectNamespaceIdFromName(MF_D1_PREFIX, database.binding);

      logger.info(`Generating SQL...`);
      const genSQLCmd = `drizzle-kit generate:sqlite --schema=${schemaDir} --out=${migrationsPath}`;
      child_process.execSync(genSQLCmd, {
        stdio: 'inherit',
        encoding: 'utf8'
      });
      console.info(chalk.blue(`Handling DB operations...`));

      const migrationsTableName = database?.migrations_table || DEFAULT_MIGRATION_TABLE;
      const d1PersistPath = path.join(getPersistencePath(persistTo, 'd1') as string, MF_D1_PREFIX);
      try {
        if (!fs.existsSync(d1PersistPath)) {
          fs.mkdirSync(d1PersistPath, { recursive: true });
        }

        const dbClient = createClient({ url: 'file:' + path.join(d1PersistPath, `${hashedBindingPath}.sqlite`) });
        const localDB = drizzle(dbClient);
        await migrate(localDB, { migrationsFolder: migrationsPath, migrationsTable: migrationsTableName });
        //
        //   const unappliedMigrations = (
        //     await getUnappliedMigrations({
        //       migrationsTableName,
        //       migrationsPath,
        //       wranglerConfig,
        //       name: database.binding,
        //       persistTo
        //     })
        //   )
        //     .map(migration => {
        //       return {
        //         name: migration,
        //         status: '🕒️'
        //       };
        //     })
        //     .sort((a, b) => {
        //       const migrationNumberA = parseInt(a.name.split('_')[0]);
        //       const migrationNumberB = parseInt(b.name.split('_')[0]);
        //       if (migrationNumberA < migrationNumberB) {
        //         return -1;
        //       }
        //       if (migrationNumberA > migrationNumberB) {
        //         return 1;
        //       }
        //
        //       // numbers must be equal
        //       return 0;
        //     });
        //
        //   if (unappliedMigrations.length === 0) {
        //     logger.log(renderToString(<Text>✅ No migrations to apply!</Text>));
        //     return;
        //   } else {
        //     logger.log(
        //       renderToString(
        //         <Box flexDirection='column'>
        //           <Text>Migrations to be applied:</Text>
        //           <Table data={unappliedMigrations} columns={['name']}></Table>
        //         </Box>
        //       )
        //     );
        //   }
        //
        console.info(chalk.blue(`Completed setup of D1 Database: ${database.binding}`));
      } catch (e) {
        logger.error(e);
      }
    }
  } else {
    console.info(yellow(`Skipping D1 setup. --d1 not specified or no d1_databases defined in wrangler.toml`));
  }
};

export const handleKV = async (kv_namespaces: Config['kv_namespaces'], persistTo: string, reset?: boolean) => {
  const persistencePath = path.join(persistTo, 'v3', 'kv');
  if (kv_namespaces && kv_namespaces.length > 0) {
    for (const kv of kv_namespaces) {
      if (reset) {
        resetCFAssets(persistencePath);
      }
      console.info(chalk.blue(`Preparing to setup KV: ${kv.binding}`));
    }
  } else {
    console.info(yellow(`Skipping KV setup. --kv not specified or no kv_namespaces defined in wrangler.toml`));
  }
};

export const handleR2 = async (r2_buckets: Config['r2_buckets'], persistTo: string, reset?: boolean) => {
  const persistencePath = path.join(persistTo, 'v3', 'r2');
  if (r2_buckets && r2_buckets.length > 0) {
    for (const r2_bucket of r2_buckets) {
      if (reset) {
        resetCFAssets(persistencePath);
      }
      console.info(chalk.blue(`Preparing to setup R2: ${r2_bucket.binding}`));
    }
  } else {
    console.info(yellow(`Skipping R2 setup. --r2 not specified or no r2_buckets defined in wrangler.toml`));
  }
};
