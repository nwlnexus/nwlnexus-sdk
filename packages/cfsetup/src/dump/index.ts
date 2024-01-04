import type { CommonYargsArgv, StrictYargsOptionsToInterface } from '../root-arguments';

import { inspect } from 'node:util';

import { withWranglerConfig } from '../config';

export function dumpOptions(args: CommonYargsArgv) {
  return args.option('file', {
    description: 'Dump to file',
    default: false,
    requiresArg: false,
    type: 'boolean'
  });
}

type DumpHandlerOptions = StrictYargsOptionsToInterface<typeof dumpOptions>;

export const dumpHandler = withWranglerConfig<DumpHandlerOptions>(async ({ wranglerConfig }) => {
  console.log(inspect(wranglerConfig, { sorted: true, colors: true, depth: 5 }));
});
