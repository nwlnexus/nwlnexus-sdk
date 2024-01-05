import type { CommonYargsArgv } from '../root-arguments';

import path from 'node:path';
import process from 'node:process';

import * as D1 from './d1';
import * as KV from './kv';
import * as R2 from './r2';

export function CommonOptions(yargs: CommonYargsArgv) {
  return yargs
    .option('persist-to', {
      description: 'Directory for wrangler state.',
      default: path.join(process.cwd(), '.wrangler/'),
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

export async function prepare(args: CommonYargsArgv) {
  return args
    .command('d1', 'Prepare D1 Database', D1.CmdOptions, D1.CmdHandler)
    .command('kv', 'Prepare KV Namespace', KV.CmdOptions, KV.CmdHandler)
    .command('r2', 'Prepare R2 Bucket', R2.CmdOptions, R2.CmdHandler);
}
