import type { CommonYargsArgv, StrictYargsOptionsToInterface } from '../root-arguments';

import child_process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { globSync } from 'glob';
import { Box, Text } from 'ink';
import Table from 'ink-table';

import { yellow } from '../colors';
import { withWranglerConfig } from '../config';
import { logger } from '../logger';
import { resetCFAssets } from '../reset';
import { renderToString } from '../utils/render';
import { DEFAULT_MIGRATION_PATH, DEFAULT_MIGRATION_TABLE, MF_D1_PREFIX } from './constants';
import { durableObjectNamespaceIdFromName, getPersistencePath } from './helpers';
import { CommonOptions } from './index';

export function CmdOptions(yargs: CommonYargsArgv) {
  return CommonOptions(yargs).option('schema-dir', {
    description: 'Directory to source schemas from.',
    demandOption: true,
    requiresArg: true,
    nargs: 1,
    type: 'string',
    normalize: true
  });
}

type D1HandlerOptions = StrictYargsOptionsToInterface<typeof CmdOptions>;

export const CmdHandler = withWranglerConfig<D1HandlerOptions>(
  async ({ wranglerConfig, schemaDir, persistTo, reset = false, seed }): Promise<void> => {
    const d1_databases = wranglerConfig.d1_databases;
    if (d1_databases && d1_databases.length > 0) {
      for (const database of d1_databases) {
        const migrationsPath = database?.migrations_dir || DEFAULT_MIGRATION_PATH;
        if (reset) {
          resetCFAssets(getPersistencePath(persistTo, 'd1', [migrationsPath]));
        }

        logger.log(`Preparing to setup D1 Database: ${database.binding}`);
        const hashedBindingPath = durableObjectNamespaceIdFromName(MF_D1_PREFIX, database.binding);

        logger.log(`Generating SQL...`);
        const genSQLCmd = `drizzle-kit generate:sqlite --schema=${schemaDir} --out=${migrationsPath}`;
        child_process.execSync(genSQLCmd, {
          stdio: 'inherit',
          encoding: 'utf8'
        });
        logger.log(`Handling DB operations...`);

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
          if (seed) {
            logger.log(`Handling seeding operations...`);
            const SEED_DIR = path.join(process.cwd(), 'seeds');
            const SQL_PATTERN = `${SEED_DIR}/**/*.sql`;

            // Get all SQL seed files
            const seedFiles = globSync(SQL_PATTERN, {
              nodir: true,
              stat: true,
              absolute: true,
              dotRelative: true
            });

            if (seedFiles.length <= 0) {
              logger.log(renderToString(<Text>✅ No SQL seed files!</Text>));
            } else {
              const unappliedSeedFiles = seedFiles.map(f => {
                return {
                  name: f,
                  status: '🕒️'
                };
              });
              logger.log(
                renderToString(
                  <Box flexDirection='column'>
                    <Text>Seeds to be applied:</Text>
                    <Table data={unappliedSeedFiles} columns={['name']}></Table>
                  </Box>
                )
              );
            }
          }
          logger.log(`Completed setup of D1 Database: ${database.binding}`);
        } catch (e) {
          logger.error(e);
        }
      }
    } else {
      console.info(yellow(`Skipping D1 setup. --d1 not specified or no d1_databases defined in wrangler.toml`));
    }
  }
);
