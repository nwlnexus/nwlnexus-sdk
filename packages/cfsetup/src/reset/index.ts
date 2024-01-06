import type { CommonYargsArgv, StrictYargsOptionsToInterface } from '../root-arguments';

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { demandOneOfOption } from '../cli';
import { withWranglerConfig } from '../config';
import { logger } from '../logger';
import { getPersistencePath } from '../prepare/helpers';

export function resetOptions(args: CommonYargsArgv) {
  return args
    .option('all', {
      description: 'Reset all storage assets',
      default: false,
      demandOption: false,
      type: 'boolean'
    })
    .option('d1', {
      description: 'Reset D1 storage assets',
      default: false,
      demandOption: false,
      type: 'boolean'
    })
    .option('kv', {
      description: 'Reset KV storage assets',
      default: false,
      demandOption: false,
      type: 'boolean'
    })
    .option('r2', {
      description: 'Reset R2 storage assets',
      default: false,
      demandOption: false,
      type: 'boolean'
    })
    .option('persist-to', {
      description: 'Directory for wrangler state.',
      default: path.join(process.cwd(), '.wrangler/'),
      requiresArg: true,
      type: 'string',
      demandOption: false,
      normalize: true
    })
    .check(demandOneOfOption('all', 'd1', 'kv', 'r2'));
}

type ResetHandlerOptions = StrictYargsOptionsToInterface<typeof resetOptions>;

export const resetHandler = withWranglerConfig<ResetHandlerOptions>(async ({ all, d1, r2, kv, persistTo }) => {
  const d1_path = getPersistencePath(persistTo, 'd1') as string;
  const kv_path = getPersistencePath(persistTo, 'kv') as string;
  const r2_path = getPersistencePath(persistTo, 'r2') as string;

  if (all) {
    resetCFAssets([d1_path, kv_path, r2_path]);
    return;
  }
  if (d1) {
    logger.log(`Resetting local D1 storage located at ${d1_path}`);
    resetCFAssets(d1_path);
    return;
  }
  if (kv) {
    logger.log(`Resetting local KV storage located at ${kv_path}`);
    resetCFAssets(kv_path);
    return;
  }
  if (r2) {
    logger.log(`Resetting local R2 storage located at ${r2_path}`);
    resetCFAssets(r2_path);
    return;
  }
});

export function resetCFAssets(paths: string | string[]) {
  if (Array.isArray(paths) && paths.length > 0) {
    for (const p of paths) {
      fs.rmSync(p, { recursive: true, force: true });
    }
  }
  if (typeof paths == 'string') {
    fs.rmSync(paths, { recursive: true, force: true });
  }
}
