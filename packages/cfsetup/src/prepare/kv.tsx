import type { CommonYargsArgv, StrictYargsOptionsToInterface } from '../root-arguments';

import path from 'node:path';
import chalk from 'chalk';

import { yellow } from '../colors';
import { withWranglerConfig } from '../config';
import { logger } from '../logger';
import { resetCFAssets } from '../reset';
import { CommonOptions } from './index';

export function CmdOptions(yargs: CommonYargsArgv) {
  return CommonOptions(yargs);
}

type KVHandlerOptions = StrictYargsOptionsToInterface<typeof CmdOptions>;
export const CmdHandler = withWranglerConfig<KVHandlerOptions>(
  async ({ wranglerConfig, persistTo, reset = false, seed }): Promise<void> => {
    logger.log(seed);
    const kv_namespaces = wranglerConfig.kv_namespaces;
    const persistencePath = path.join(persistTo, 'v3', 'kv');
    if (kv_namespaces && kv_namespaces.length > 0) {
      for (const kv of kv_namespaces) {
        if (reset) {
          resetCFAssets(persistencePath);
        }
        console.info(chalk.blue(`Preparing to setup KV: ${kv.binding}`));
      }
    } else {
      console.info(yellow(`Skipping KV setup. --kv not specified or no kv_namespaces defined in wrangler.toml`));
    }
  }
);
