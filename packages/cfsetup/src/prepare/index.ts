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

export const prepareHandler = withWranglerConfig<StrictYargsOptionsToInterface<typeof prepareOptions>>(
  async ({ wranglerConfig, schemaDir, persistTo, reset, storage }) => {
    switch (storage) {
      case 'all': {
        await handleD1(wranglerConfig, schemaDir, persistTo, reset);
        await handleKV(wranglerConfig.kv_namespaces, persistTo, reset);
        await handleR2(wranglerConfig.r2_buckets, persistTo, reset);
        break;
      }
      case 'd1': {
        await handleD1(wranglerConfig, schemaDir, persistTo, reset);
        break;
      }
      case 'kv': {
        await handleKV(wranglerConfig.kv_namespaces, persistTo, reset);
        break;
      }
      case 'r2': {
        await handleR2(wranglerConfig.r2_buckets, persistTo, reset);
        break;
      }
    }
  }
);
