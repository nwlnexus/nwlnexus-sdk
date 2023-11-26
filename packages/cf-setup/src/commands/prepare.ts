import path from 'node:path';
import process from 'node:process';
import { CFAssetOptions } from '../cf-assets-options.js';
import toml from 'toml';
import fs from 'node:fs';
import chalk from 'chalk';
import { resetCFAssets } from '../helpers/reset.js';
import { setupDB } from '../helpers/d1.js';
import { setupKV } from '../helpers/kv.js';
import { setupR2 } from '../helpers/r2.js';
import { ArgumentsCamelCase, Argv } from 'yargs';

export type PrepareArguments = {
  wranglerFile: string;
  persistTo: string;
  schemaDir: string;
  dryRun?: boolean;
  reset?: boolean;
  all: boolean;
  d1?: boolean;
  kv?: boolean;
  r2?: boolean;
};

export const command = 'prepare';

export const describe = 'Prepare local Cloudflare assets.';

export const builder = (args: Argv): Argv<PrepareArguments> => {
  return args.options({
    wranglerFile: {
      description: 'Path to custom wrangler TOML file.',
      default: path.join(process.cwd(), './wrangler.toml'),
      demandOption: true,
      type: 'string'
    },
    persistTo: {
      description: 'Directory for wrangler state.',
      default: path.join(process.cwd(), '.wrangler/'),
      requiresArg: true,
      type: 'string',
      normalize: true
    },
    schemaDir: {
      description: 'Directory to source schemas from.',
      demandOption: true,
      requiresArg: true,
      type: 'string',
      normalize: true
    },
    reset: {
      alias: 'r',
      description: 'Delete migrations and the D1 databases/KV before applying changes.',
      requiresArg: false,
      type: 'boolean',
      conflicts: ['dry-run']
    },
    ...CFAssetOptions,
    dryRun: {
      description: 'Only print to console and make no changes',
      requiresArg: false,
      type: 'boolean',
      conflicts: ['reset']
    }
  }) as unknown as Argv<PrepareArguments>;
};

export const handler = async (args: ArgumentsCamelCase<PrepareArguments>) => {
  const wranglerCfg = toml.parse(fs.readFileSync(args.wranglerFile, 'utf-8'));

  if ((args.all || args.d1) && 'd1_databases' in wranglerCfg) {
    for (const database of wranglerCfg['d1_databases']) {
      const mDir = typeof database['migrations_dir'] == 'undefined' ? 'migrations/' : database['migrations_dir'];
      if (args.reset) {
        resetCFAssets(mDir);
        resetCFAssets(path.join(args.persistTo, 'v3/d1'));
      }
      await setupDB(database['binding'], args.schemaDir, mDir, args.persistTo);
    }
  } else {
    console.info(
      chalk.yellow(`Skipping D1 setup. --d1 not specified or no d1_databases defined in ${args.wranglerFile}`)
    );
  }

  if ((args.all || args.kv) && 'kv_namespaces' in wranglerCfg) {
    for (const kv of wranglerCfg['kv_namespaces']) {
      if (args.reset) {
        resetCFAssets(path.join(args.persistTo, 'v3/kv'));
      }
      await setupKV(kv['binding']);
    }
  } else {
    console.info(
      chalk.yellow(`Skipping KV setup. --kv not specified or no kv_namespaces defined in ${args.wranglerFile}`)
    );
  }

  if ((args.all || args.r2) && 'r2_namespaces' in wranglerCfg) {
    for (const r2 of wranglerCfg['r2_namespaces']) {
      if (args.reset) {
        resetCFAssets(path.join(args.persistTo, 'v3/r2'));
      }
      await setupR2(r2['binding']);
    }
  } else {
    console.info(
      chalk.yellow(`Skipping R2 setup. --r2 not specified or no r2_namespaces defined in ${args.wranglerFile}`)
    );
  }
};
