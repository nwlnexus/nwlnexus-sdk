import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import type { Argv } from 'yargs';

import { STORAGE_MEDIUM } from '../constants';
import { logger } from '../logger';
import { StrictYargsOptionsToInterface } from '../root-arguments';

export function resetOptions(args: Argv) {
  return args
    .positional('storage', {
      choices: STORAGE_MEDIUM,
      type: 'string',
      demandOption: true
    })
    .options({
      'wrangler-file': {
        description: 'Path to custom wrangler TOML file.',
        type: 'string',
        demandOption: true,
        default: path.join(process.cwd(), './wrangler.toml'),
        normalize: true
      },
      persistTo: {
        description: 'Directory for wrangler state.',
        default: path.join(process.cwd(), '.wrangler/'),
        requiresArg: true,
        type: 'string',
        normalize: true
      }
    });
}
export async function resetHandler(args: StrictYargsOptionsToInterface<typeof resetOptions>) {
  switch (args.storage) {
    case 'all': {
      resetCFAssets(args.persistTo);
      break;
    }
    case 'd1': {
      logger.log(`Resetting local D1 storage located at ${path.join(args.persistTo, 'v3/d1')}`);
      resetCFAssets(path.join(args.persistTo, 'v3/d1'));
      break;
    }
    case 'kv': {
      logger.log(`Resetting local KV storage located at ${path.join(args.persistTo, 'v3/kv')}`);
      resetCFAssets(path.join(args.persistTo, 'v3/kv'));
      break;
    }
    case 'r2': {
      logger.log(`Resetting local R2 storage located at ${path.join(args.persistTo, 'v3/r2')}`);
      resetCFAssets(path.join(args.persistTo, 'v3/r2'));
      break;
    }
  }
}

export function resetCFAssets(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}
