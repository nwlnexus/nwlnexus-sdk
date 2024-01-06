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

type R2HandlerOptions = StrictYargsOptionsToInterface<typeof CmdOptions>;

export const CmdHandler = withWranglerConfig<R2HandlerOptions>(
  async ({ wranglerConfig, persistTo, reset = false, seed }): Promise<void> => {
    logger.log(seed);
    const r2_buckets = wranglerConfig.r2_buckets;
    const persistencePath = path.join(persistTo, 'v3', 'r2');
    if (r2_buckets && r2_buckets.length > 0) {
      for (const r2_bucket of r2_buckets) {
        if (reset) {
          resetCFAssets(persistencePath);
        }
        console.info(chalk.blue(`Preparing to setup R2: ${r2_bucket.binding}`));
      }
    } else {
      console.info(yellow(`Skipping R2 setup. --r2 not specified or no r2_buckets defined in wrangler.toml`));
    }
  }
);
