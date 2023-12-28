import { inspect } from 'node:util';

import { withConfig } from '../config';
import { CommonYargsArgv, StrictYargsOptionsToInterface } from '../root-arguments';

export function dumpOptions(args: CommonYargsArgv) {
  return args.option('file', {
    description: 'Dump to file',
    default: false,
    requiresArg: false,
    type: 'boolean'
  });
}

type DumpHandlerOptions = StrictYargsOptionsToInterface<typeof dumpOptions>;

export const dumpHandler = withConfig<DumpHandlerOptions>(async ({ config }) => {
  console.log(inspect(config, { sorted: true, colors: true, depth: 5 }));
});
