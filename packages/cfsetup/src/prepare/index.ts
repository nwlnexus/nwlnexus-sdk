import type { CommonYargsArgv, StrictYargsOptionsToInterface } from '../root-arguments';

import path from 'node:path';
import process from 'node:process';

import { withConfig } from '../config';
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

export const prepareHandler = withConfig<StrictYargsOptionsToInterface<typeof prepareOptions>>(
  async ({ config, schemaDir, persistTo, reset, storage }) => {
    switch (storage) {
      case 'all': {
        await handleD1(config, schemaDir, persistTo, reset);
        await handleKV(config.kv_namespaces, persistTo, reset);
        await handleR2(config.r2_buckets, persistTo, reset);
        break;
      }
      case 'd1': {
        await handleD1(config, schemaDir, persistTo, reset);
        break;
      }
      case 'kv': {
        await handleKV(config.kv_namespaces, persistTo, reset);
        break;
      }
      case 'r2': {
        await handleR2(config.r2_buckets, persistTo, reset);
        break;
      }
    }
  }
);
