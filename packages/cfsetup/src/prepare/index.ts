import path from 'node:path';
import process from 'node:process';

import { yellow } from '../colors';
import { STORAGE_MEDIUM } from '../constants';
import { parseTOML, readFileSync } from '../parse';
import { resetCFAssets } from '../reset';
import { RootArgumentsArgv, StrictYargsOptionsToInterface } from '../root-arguments';
import { setupDB, setupKV, setupR2 } from './storage';

export function prepareOptions(args: RootArgumentsArgv) {
  return args
    .positional('storage', {
      choices: STORAGE_MEDIUM,
      default: 'all',
      type: 'string',
      demandOption: true
    })
    .option('wrangler-file', {
      description: 'Path to custom wrangler TOML file.',
      type: 'string',
      demandOption: true,
      default: path.join(process.cwd(), './wrangler.toml'),
      normalize: true
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
      type: 'string'
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

export async function prepareHandler(args: StrictYargsOptionsToInterface<typeof prepareOptions>) {
  const wranglerCfg = parseTOML(readFileSync(args.wranglerFile), args.wranglerFile);

  const handleD1 = async () => {
    if ('d1_databases' in wranglerCfg) {
      for (const database of wranglerCfg.d1_databases as Array<Record<string, string>>) {
        const mDir = typeof database['migrations_dir'] == 'undefined' ? 'migrations/' : database['migrations_dir'];
        if (args.reset) {
          resetCFAssets(mDir);
          resetCFAssets(path.join(args.persistTo, 'v3/d1'));
        }
        await setupDB(database['binding'], args.schemaDir, mDir, args.persistTo);
      }
    } else {
      console.info(yellow(`Skipping D1 setup. --d1 not specified or no d1_databases defined in ${args.wranglerFile}`));
    }
  };

  const handleKV = async () => {
    if ('kv_namespaces' in wranglerCfg) {
      for (const kv of wranglerCfg.kv_namespaces as Array<Record<string, string>>) {
        if (args.reset) {
          resetCFAssets(path.join(args.persistTo, 'v3/kv'));
        }
        await setupKV(kv['binding']);
      }
    } else {
      console.info(yellow(`Skipping KV setup. --kv not specified or no kv_namespaces defined in ${args.wranglerFile}`));
    }
  };

  const handleR2 = async () => {
    if ('r2_namespaces' in wranglerCfg) {
      for (const r2 of wranglerCfg.r2_namespaces as Array<Record<string, string>>) {
        if (args.reset) {
          resetCFAssets(path.join(args.persistTo, 'v3/r2'));
        }
        await setupR2(r2['binding']);
      }
    } else {
      console.info(yellow(`Skipping R2 setup. --r2 not specified or no r2_namespaces defined in ${args.wranglerFile}`));
    }
  };

  switch (args.storage) {
    case 'all': {
      await handleD1();
      await handleKV();
      await handleR2();
      break;
    }
    case 'd1': {
      await handleD1();
      break;
    }
    case 'kv': {
      await handleKV();
      break;
    }
    case 'r2': {
      await handleR2();
      break;
    }
  }
}
