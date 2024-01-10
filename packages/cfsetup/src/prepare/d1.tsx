import type { ParseError } from '../parse';
import type { CommonYargsArgv, StrictYargsOptionsToInterface } from '../root-arguments';

import child_process from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { createClient } from '@libsql/client';
import { Box, Text } from 'ink';
import Table from 'ink-table';

import { yellow } from '../colors';
import { withWranglerConfig } from '../config';
import { confirm } from '../dialogs';
import { CI } from '../is-ci';
import isInteractive from '../is-interactive';
import { logger } from '../logger';
import { resetCFAssets } from '../reset';
import { renderToString } from '../utils/render';
import { DEFAULT_MIGRATION_PATH, DEFAULT_MIGRATION_TABLE, MF_D1_PREFIX } from './constants';
import {
  durableObjectNamespaceIdFromName,
  executeSql,
  getPersistencePath,
  getUnappliedSQLFiles,
  initMigrationsTable
} from './helpers';
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
    const d1PersistPath = path.join(getPersistencePath(persistTo, 'd1') as string, MF_D1_PREFIX);

    // We want to remove the migrations directory for each database once before we
    // regenrate the sql from the schema below.
    // Same is true for the wrangler persist directory. Delete it once prior to any
    // operations being performed.
    if (reset && d1_databases && d1_databases.length > 0) {
      const pathsToRemove: string[] = [];

      for (const database of d1_databases) {
        pathsToRemove.push(database?.migrations_dir || DEFAULT_MIGRATION_PATH);
      }
      resetCFAssets([d1PersistPath, ...new Set(pathsToRemove)]);
    }

    if (d1_databases && d1_databases.length > 0) {
      for (const database of d1_databases) {
        const migrationsPath = database?.migrations_dir || DEFAULT_MIGRATION_PATH;

        logger.log(`Preparing to setup D1 Database: ${database.binding}`);
        const hashedBindingPath = durableObjectNamespaceIdFromName(MF_D1_PREFIX, database.binding);

        logger.log(`Generating SQL...`);
        const genSQLCmd = `drizzle-kit generate:sqlite --schema=${schemaDir} --out=${migrationsPath}`;
        child_process.execSync(genSQLCmd, {
          stdio: 'inherit',
          encoding: 'utf8'
        });
        const migrationsTableName = database?.migrations_table || DEFAULT_MIGRATION_TABLE;

        try {
          if (!fs.existsSync(d1PersistPath)) {
            fs.mkdirSync(d1PersistPath, { recursive: true });
          }

          const dbClient = createClient({ url: 'file:' + path.join(d1PersistPath, `${hashedBindingPath}.sqlite`) });
          await initMigrationsTable({
            name: database.binding,
            client: dbClient,
            migrationsTableName,
            persistTo: d1PersistPath,
            wranglerConfig
          });

          const unappliedMigrations = (
            await getUnappliedSQLFiles({
              name: database.binding,
              client: dbClient,
              migrationsTableName,
              persistTo,
              wranglerConfig,
              sqlFilesPath: migrationsPath
            })
          )
            .map(migration => {
              return {
                name: migration,
                status: '🕒️'
              };
            })
            .sort((a, b) => {
              const migrationNumberA = parseInt(a?.name?.split('_')[0]!);
              const migrationNumberB = parseInt(b?.name?.split('_')[0]!);
              if (migrationNumberA < migrationNumberB) {
                return -1;
              }
              if (migrationNumberA > migrationNumberB) {
                return 1;
              }

              // numbers must be equal
              return 0;
            });

          if (unappliedMigrations.length === 0) {
            logger.log(renderToString(<Text>✅ No migrations to apply!</Text>));
          } else {
            logger.log(
              renderToString(
                <Box flexDirection='column'>
                  <Text>Migrations to be applied:</Text>
                  <Table data={unappliedMigrations} columns={['name']}></Table>
                </Box>
              )
            );

            const ok = await confirm(`About to apply ${unappliedMigrations.length} migration(s)
Your database may not be available to serve requests during the operation, continue?`);
            if (ok) {
              for (const migration of unappliedMigrations) {
                let query = fs.readFileSync(`${migrationsPath}/${migration.name}`, 'utf-8');
                query += `
                        INSERT INTO ${migrationsTableName} (name, hash)
                        values ('${migration.name}',
                                '${crypto.createHash('sha1').update(query).digest('hex')}');
                    `;

                let success = true;
                let errorNotes: string[] = [];
                try {
                  const response = await executeSql({
                    client: dbClient,
                    command: query,
                    file: undefined,
                    json: undefined,
                    name: database.binding,
                    persistTo,
                    shouldPrompt: isInteractive() && !CI.isCI(),
                    wranglerConfig
                  });

                  if (response === null) return;
                } catch (e) {
                  const err = e as ParseError;
                  const maybeCause = (err.cause ?? err) as Error;

                  success = false;
                  errorNotes = err.notes?.map(msg => msg.text) ?? [maybeCause?.message ?? maybeCause.toString()];
                }

                migration.status = success ? '✅' : '❌';

                console.log(
                  renderToString(
                    <Box flexDirection='column'>
                      <Table data={unappliedMigrations} columns={['name', 'status']} />
                      {errorNotes.length > 0 && (
                        <Box flexDirection='column'>
                          <Text>&nbsp;</Text>
                          <Text>
                            ❌ Migration {migration.name}{' '}
                            {errorNotes.length > 0 ? 'failed with the following errors:' : ''}
                          </Text>
                        </Box>
                      )}
                    </Box>
                  )
                );

                if (errorNotes.length > 0) {
                  new Error(
                    errorNotes
                      .map(err => {
                        return err;
                      })
                      .join('\n')
                  );
                }
              }
            }
          }

          if (seed) {
            const SEED_DIR = path.join(process.cwd(), 'seeds');

            // Get all SQL seed files
            const unappliedSeedFiles = (
              await getUnappliedSQLFiles({
                name: database.binding,
                client: dbClient,
                migrationsTableName,
                persistTo,
                wranglerConfig,
                sqlFilesPath: SEED_DIR
              })
            )
              .map(seedFile => {
                return {
                  name: seedFile,
                  status: '🕒️'
                };
              })
              .sort((a, b) => {
                const migrationNumberA = parseInt(a?.name?.split('_')[0]!);
                const migrationNumberB = parseInt(b?.name?.split('_')[0]!);
                if (migrationNumberA < migrationNumberB) {
                  return -1;
                }
                if (migrationNumberA > migrationNumberB) {
                  return 1;
                }

                // numbers must be equal
                return 0;
              });

            if (unappliedSeedFiles.length === 0) {
              console.log(renderToString(<Text>✅ No SQL seed files!</Text>));
            } else {
              console.log(
                renderToString(
                  <Box flexDirection='column'>
                    <Text>Seeds to be applied:</Text>
                    <Table data={unappliedSeedFiles} columns={['name']}></Table>
                  </Box>
                )
              );

              const ok = await confirm(`About to apply ${unappliedSeedFiles.length} migration(s)
Your database may not be available to serve requests during the operation, continue?`);
              if (ok) {
                for (const seedFile of unappliedSeedFiles) {
                  let query = fs.readFileSync(`${SEED_DIR}/${seedFile.name}`, 'utf-8');
                  query += `
                        INSERT INTO ${migrationsTableName} (name, hash)
                        values ('${seedFile.name}',
                                '${crypto.createHash('sha1').update(query).digest('hex')}');
                    `;

                  let success = true;
                  let errorNotes: string[] = [];
                  try {
                    const response = await executeSql({
                      client: dbClient,
                      command: query,
                      file: undefined,
                      json: undefined,
                      name: database.binding,
                      persistTo,
                      shouldPrompt: isInteractive() && !CI.isCI(),
                      wranglerConfig
                    });

                    if (response === null) return;
                  } catch (e) {
                    const err = e as ParseError;
                    const maybeCause = (err.cause ?? err) as Error;

                    success = false;
                    errorNotes = err.notes?.map(msg => msg.text) ?? [maybeCause?.message ?? maybeCause.toString()];
                  }

                  seedFile.status = success ? '✅' : '❌';

                  console.log(
                    renderToString(
                      <Box flexDirection='column'>
                        <Table data={unappliedSeedFiles} columns={['name', 'status']} />
                        {errorNotes.length > 0 && (
                          <Box flexDirection='column'>
                            <Text>&nbsp;</Text>
                            <Text>
                              ❌ Migration {seedFile.name}{' '}
                              {errorNotes.length > 0 ? 'failed with the following errors:' : ''}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    )
                  );

                  if (errorNotes.length > 0) {
                    new Error(
                      errorNotes
                        .map(err => {
                          return err;
                        })
                        .join('\n')
                    );
                  }
                }
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      console.info(yellow(`Skipping D1 setup. --d1 not specified or no d1_databases defined in wrangler.toml`));
    }
  }
);
