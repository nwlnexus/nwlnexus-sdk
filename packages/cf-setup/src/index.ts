#!/usr/bin/env node
import process from 'node:process';
import chalk from 'chalk';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import * as packageFile from '../package.json';
import { commands } from './commands/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const parser = yargs(hideBin(process.argv))
  .scriptName('cf-setup')
  .command(commands)
  .wrap(null)
  .version(packageFile.default.version)
  .alias('v', 'version')
  .help()
  .alias('h', 'help')
  .showHelpOnFail(false, 'Specify --help or help for available options');

(async () => {
  console.info(chalk.yellow(`Running from: ${process.cwd()}`));
  await parser.parse();
})();
