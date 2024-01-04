import type { CommonYargsArgv, StrictYargsOptionsToInterface } from '../root-arguments';

import path from 'node:path';
import process from 'node:process';

import { withWranglerConfig } from '../config';
import { STORAGE_MEDIUM } from '../constants';
import { handleD1, handleKV, handleR2 } from './utils';

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
    .option('seed', {
      description: 'Apply seed files as well.',
      default: true,
      type: 'boolean',
      conflicts: ['dry-run']
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

export const prepareHandler = withWranglerConfig<StrictYargsOptionsToInterface<typeof prepareOptions>>(
  async ({ wranglerConfig, schemaDir, persistTo, reset, storage, seed }) => {
    switch (storage) {
      case 'all': {
        await handleD1({ wranglerConfig, schemaDir, persistTo, reset, seed });
        await handleKV({ wranglerConfig, persistTo, reset, seed });
        await handleR2({ wranglerConfig, persistTo, reset, seed });
        break;
      }
      case 'd1': {
        await handleD1({ wranglerConfig, schemaDir, persistTo, reset, seed });
        break;
      }
      case 'kv': {
        await handleKV({ wranglerConfig, persistTo, reset, seed });
        break;
      }
      case 'r2': {
        await handleR2({ wranglerConfig, persistTo, reset, seed });
        break;
      }
    }
  }
);
