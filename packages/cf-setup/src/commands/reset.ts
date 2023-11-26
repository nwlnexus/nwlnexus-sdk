import path from 'node:path';
import process from 'node:process';
import { CFAssetOptions } from '../cf-assets-options.js';
import { resetCFAssets } from '../helpers/reset.js';
import { ArgumentsCamelCase, Argv } from 'yargs';

export type ResetArguments = {
  persistTo: string;
  all: boolean;
  d1?: boolean;
  kv?: boolean;
  r2?: boolean;
};

export const command = 'reset';
export const description = 'Reset local Cloudflare assets.';
export const builder = (args: Argv): Argv<ResetArguments> => {
  return args.options({
    ...CFAssetOptions,
    persistTo: {
      description: 'Directory for wrangler state.',
      default: path.join(process.cwd(), '.wrangler/'),
      requiresArg: true,
      type: 'string',
      normalize: true
    }
  }) as unknown as Argv<ResetArguments>;
};
export const handler = async (args: ArgumentsCamelCase<ResetArguments>) => {
  if (args.d1) {
    resetCFAssets(path.join(args.persistTo, 'v3/d1'));
  } else if (args.kv) {
    resetCFAssets(path.join(args.persistTo, 'v3/kv'));
  } else if (args.r2) {
    resetCFAssets(path.join(args.persistTo, 'v3/r2'));
  } else {
    resetCFAssets(args.persistTo);
  }
};
