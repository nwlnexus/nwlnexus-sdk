import path from 'node:path';
import process from 'node:process';

import { yellow } from '../colors';
import { withConfig } from '../config';
import { STORAGE_MEDIUM } from '../constants';
import { resetCFAssets } from '../reset';
import { CommonYargsArgv, StrictYargsOptionsToInterface } from '../root-arguments';
import { setupDB, setupKV, setupR2 } from './storage';

export function prepareOptions(args: CommonYargsArgv) {
  return args
    .positional('storage', {
      choices: STORAGE_MEDIUM,
      default: 'all',
      type: 'string',
      demandOption: false
    })
    .option('persist-to', {
      description: 'Directory for wrangler state.',
      default: path.join(process.cwd(), '.wrangler/'),
      requiresArg: true,
      nargs: 1,
      type: 'string',
      normalize: true
    })
    .option('schema-dir', {
      description: 'Directory to source schemas from.',
      demandOption: true,
      requiresArg: true,
      nargs: 1,
      type: 'string',
      normalize: true
    })
    .option('seed-dir', {
      description: 'Directory to source pregenerated seed files from.',
      demandOption: false,
      requiresArg: true,
      nargs: 1,
      type: 'string',
      normalize: true
    })
    .option('reset', {
      alias: 'r',
      description: 'Delete migrations and the D1 databases/KV before applying changes.',
      requiresArg: false,
      type: 'boolean',
      conflicts: ['dry-run']
    })
    .option('dry-run', {
      description: 'Only print to console and make no changes',
      requiresArg: false,
      type: 'boolean',
      conflicts: ['reset']
    });
}

export const prepareHandler = withConfig<StrictYargsOptionsToInterface<typeof prepareOptions>>(
  async ({ config, schemaDir, persistTo, reset, storage }) => {
    const handleD1 = async () => {
      if ('d1_databases' in config) {
        for (const database of config.d1_databases as Array<Record<string, string>>) {
          const mDir = typeof database['migrations_dir'] == 'undefined' ? 'migrations/' : database['migrations_dir'];
          if (reset) {
            resetCFAssets(mDir);
            resetCFAssets(path.join(persistTo, 'v3/d1'));
          }
          await setupDB(database['binding'], schemaDir, mDir, persistTo);
        }
      } else {
        console.info(yellow(`Skipping D1 setup. --d1 not specified or no d1_databases defined in wrangler.toml`));
      }
    };

    const handleKV = async () => {
      if ('kv_namespaces' in config) {
        for (const kv of config.kv_namespaces as Array<Record<string, string>>) {
          if (reset) {
            resetCFAssets(path.join(persistTo, 'v3/kv'));
          }
          await setupKV(kv['binding']);
        }
      } else {
        console.info(yellow(`Skipping KV setup. --kv not specified or no kv_namespaces defined in wrangler.toml`));
      }
    };

    const handleR2 = async () => {
      if ('r2_namespaces' in config) {
        for (const r2 of config.r2_namespaces as Array<Record<string, string>>) {
          if (reset) {
            resetCFAssets(path.join(persistTo, 'v3/r2'));
          }
          await setupR2(r2['binding']);
        }
      } else {
        console.info(yellow(`Skipping R2 setup. --r2 not specified or no r2_namespaces defined in wrangler.toml`));
      }
    };

    switch (storage) {
      case 'all': {
        await handleD1();
        await handleKV();
        await handleR2();
        break;
      }
      case 'd1': {
        await handleD1();
        break;
      }
      case 'kv': {
        await handleKV();
        break;
      }
      case 'r2': {
        await handleR2();
        break;
      }
    }
  }
);
