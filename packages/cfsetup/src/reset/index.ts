import type { CommonYargsArgv, StrictYargsOptionsToInterface } from '../root-arguments';

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { withWranglerConfig } from '../config';
import { STORAGE_MEDIUM } from '../constants';
import { logger } from '../logger';
import { getPersistencePath } from '../prepare/helpers';

export function resetOptions(args: CommonYargsArgv) {
  return args
    .positional('storage', {
      choices: STORAGE_MEDIUM,
      type: 'string',
      demandOption: true
    })
    .option('persist-to', {
      description: 'Directory for wrangler state.',
      default: path.join(process.cwd(), '.wrangler/'),
      requiresArg: true,
      type: 'string',
      normalize: true
    });
}

type ResetHandlerOptions = StrictYargsOptionsToInterface<typeof resetOptions>;

export const resetHandler = withWranglerConfig<ResetHandlerOptions>(async ({ storage, persistTo }) => {
  const d1_path = getPersistencePath(persistTo, 'd1') as string;
  const kv_path = getPersistencePath(persistTo, 'kv') as string;
  const r2_path = getPersistencePath(persistTo, 'r2') as string;

  switch (storage) {
    case 'all': {
      resetCFAssets([d1_path, kv_path, r2_path]);
      break;
    }
    case 'd1': {
      logger.log(`Resetting local D1 storage located at ${d1_path}`);
      resetCFAssets(d1_path);
      break;
    }
    case 'kv': {
      logger.log(`Resetting local KV storage located at ${kv_path}`);
      resetCFAssets(kv_path);
      break;
    }
    case 'r2': {
      logger.log(`Resetting local R2 storage located at ${r2_path}`);
      resetCFAssets(r2_path);
      break;
    }
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
