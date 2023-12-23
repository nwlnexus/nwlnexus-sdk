import path from 'node:path';
import process from 'node:process';
import { inspect } from 'node:util';

import { parseTOML, readFileSync } from '../parse';
import { RootArgumentsArgv, StrictYargsOptionsToInterface } from '../root-arguments';

export function dumpOptions(args: RootArgumentsArgv) {
  return args
    .option('wrangler-file', {
      description: 'Path to custom wrangler TOML file.',
      type: 'string',
      demandOption: true,
      default: path.join(process.cwd(), './wrangler.toml'),
      normalize: true
    })
    .option('file', {
      description: 'Dump to file',
      default: false,
      requiresArg: false,
      type: 'boolean'
    });
}

export async function dumpHandler(args: StrictYargsOptionsToInterface<typeof dumpOptions>) {
  const wranglerCfg = parseTOML(readFileSync(args.wranglerFile), args.wranglerFile);

  console.log(inspect(wranglerCfg, { sorted: true, colors: true, depth: 5 }));
}
