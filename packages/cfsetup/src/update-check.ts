import chalk from 'chalk';
import supportsColor from 'supports-color';
import checkForUpdate from 'update-check';
import type { Result } from 'update-check';

import pkg, { version as cfsetupVersion } from '../package.json';
import { logger } from './logger';

export async function printCfSetupBanner(performUpdateCheck = true) {
  let text = ` ⛅️ cfsetup ${cfsetupVersion}`;
  let maybeNewVersion: string | undefined;
  if (performUpdateCheck) {
    maybeNewVersion = await updateCheck();
    if (maybeNewVersion !== undefined) {
      text += ` (update available ${chalk.green(maybeNewVersion)})`;
    }
  }

  logger.log(
    text + '\n' + (supportsColor.stdout ? chalk.hex('#FF8800')('-'.repeat(text.length)) : '-'.repeat(text.length))
  );

  // Log a slightly more noticeable message if this is a major bump
  if (maybeNewVersion !== undefined) {
    const currentMajor = parseInt(cfsetupVersion.split('.')[0]);
    const newMajor = parseInt(maybeNewVersion.split('.')[0]);
    if (newMajor > currentMajor) {
      logger.warn(
        `The version of CFSetup you are using is now out-of-date.
Please update to the latest version to prevent critical errors.`
      );
    }
  }
}

async function doUpdateCheck(): Promise<string | undefined> {
  let update: Result | null = null;
  try {
    // default cache for update check is 1 day
    update = await checkForUpdate(pkg, {
      distTag: pkg.version.startsWith('0.0.0') ? 'beta' : 'latest'
    });
  } catch (err) {
    // ignore error
  }
  return update?.latest;
}

// Memoise update check promise, so we can call this multiple times as required
// without having to prop drill the result. It's unlikely to change through the
// process lifetime.
let updateCheckPromise: Promise<string | undefined>;
export function updateCheck(): Promise<string | undefined> {
  return (updateCheckPromise ??= doUpdateCheck());
}
