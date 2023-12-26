// noinspection SpellCheckingInspection

import os from 'node:os';
import process from 'node:process';

import Yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import makeCLI from 'yargs/yargs';

import { version as cfsetupVersion, name as pkgName } from '../package.json';
import { dumpHandler, dumpOptions } from './dump';
import { FatalError } from './errors';
import { logger } from './logger';
import { pages } from './pages';
import { formatMessage, ParseError } from './parse';
import { prepareHandler, prepareOptions } from './prepare';
import { resetHandler, resetOptions } from './reset';
import { RootArguments, RootArgumentsArgv } from './root-arguments';
import { printCfSetupBanner } from './update-check';

export class CommandLineArgsError extends Error {}

// a helper to demand one of a set of options
// via https://github.com/yargs/yargs/issues/1093#issuecomment-491299261
export function demandOneOfOption(...options: string[]) {
  return function (argv: Yargs.Arguments) {
    const count = options.filter(option => argv[option]).length;
    const lastOption = options.pop();

    if (count === 0) {
      throw new CommandLineArgsError(
        `Exactly one of the arguments ${options.join(', ')} and ${lastOption} is required`
      );
    } else if (count > 1) {
      throw new CommandLineArgsError(`Arguments ${options.join(', ')} and ${lastOption} are mutually exclusive`);
    }

    return true;
  };
}

function createCLIParser(argv: string[]) {
  const cfsetup: RootArgumentsArgv = makeCLI(argv)
    .strict()
    .showHelpOnFail(false)
    .fail((msg, error) => {
      if (!error || error.name === 'YError') {
        // If there is no error or the error is a "YError", then this came from yargs own validation
        // Wrap it in a `CommandLineArgsError` so that we can handle it appropriately further up.
        error = new CommandLineArgsError(msg);
      }
      throw error;
    })
    .scriptName(pkgName)
    .wrap(null)
    // Define global options here, so they get included in the `Argv` type of
    // the `cfsetup` variable
    .version(false)
    .option('yaml', {
      description: 'Output in YAML format.',
      type: 'boolean'
    })
    .option('debug', {
      description: 'Debug mode.',
      type: 'boolean'
    })
    .option('v', {
      alias: 'version',
      description: 'Show version number',
      type: 'boolean'
    });

  cfsetup.group(['yaml', 'debug', 'help', 'version'], 'Flags:');
  cfsetup.help().alias('h', 'help');

  // Default help command that supports the subcommands
  const subHelp: Yargs.CommandModule<RootArguments, RootArguments> = {
    command: ['*'],
    handler: async args => {
      setImmediate(() => cfsetup.parse([...args._.map((a: any) => `${a}`), '--help']));
    }
  };

  cfsetup.command(
    ['*'],
    false,
    () => {},
    async args => {
      if (args._.length > 0) {
        throw new CommandLineArgsError(`Unknown command: ${args._}.`);
      } else {
        if (args.v) {
          if (process.stdout.isTTY) {
            await printCfSetupBanner();
          } else {
            logger.log(cfsetupVersion);
          }
        } else {
          cfsetup.showHelp('log');
        }
      }
    }
  );

  // You will note that we use the form for all commands where we use the builder function
  // to define options and subcommands.
  // Further we return the result of this builder even though it's not completely necessary.
  // The reason is that it's required for type inference of the args in the handle function.
  // I wish we could enforce this pattern, but this comment will have to do for now.
  // (It's also annoying that choices[] doesn't get inferred as an enum. 🤷‍♂.)

  //init
  cfsetup.command('init', '✨  Create local repository project', prepareOptions, prepareHandler);

  cfsetup.command('dump', '✨  Dump current environment variables and parsed files', dumpOptions, dumpHandler);

  //prepare
  cfsetup.command(
    'prepare <storage> [options..]',
    '🥣 Prepare local development environment',
    prepareOptions,
    prepareHandler
  );

  //reset
  cfsetup.command(
    'reset <storage> [options..]',
    '💥 Reset local Cloudflare Storage assets',
    resetOptions,
    resetHandler
  );

  //project
  cfsetup.command('pages [command..]', '⚡️ Manage CF Pages Project', pagesYargs => {
    return pages(pagesYargs.command(subHelp));
  });

  //deploy
  cfsetup.command('deploy', '🚀 Deploy local project', prepareOptions, prepareHandler);

  // This set is to false to allow overwriting of default behaviour
  cfsetup.version(false);

  // version
  cfsetup.command(
    'version',
    false,
    () => {},
    async () => {
      if (process.stdout.isTTY) {
        await printCfSetupBanner();
      } else {
        logger.log(cfsetupVersion);
      }
    }
  );

  cfsetup.exitProcess(false);

  return cfsetup;
}
async function main(argv: string[]): Promise<void> {
  const cfsetup = createCLIParser(argv);
  try {
    await cfsetup.parse();
  } catch (e) {
    logger.log(''); // Just adds a bit of space
    if (e instanceof CommandLineArgsError) {
      logger.error(e.message);
      // We are not able to ask the `cfsetup` CLI parser to show help for a subcommand programmatically.
      // The workaround is to re-run the parsing with an additional `--help` flag, which will result in the correct help message being displayed.
      // The `cfsetup` object is "frozen"; we cannot reuse that with different args, so we must create a new CLI parser to generate the help message.
      await createCLIParser([...argv, '--help']).parse();
    } else if (e instanceof ParseError) {
      e.notes.push({
        text: '\nIf you think this is a bug, please open an issue at: https://github.com/cloudflare/workers-sdk/issues/new/choose'
      });
      logger.log(formatMessage(e));
    } else if (e instanceof Error && e.message.includes('Raw mode is not supported on')) {
      // the current terminal doesn't support raw mode, which Ink needs to render
      // Ink doesn't throw a typed error or subclass or anything, so we just check the message content.
      // https://github.com/vadimdemedes/ink/blob/546fe16541fd05ad4e638d6842ca4cbe88b4092b/src/components/App.tsx#L138-L148

      const currentPlatform = os.platform();

      const thisTerminalIsUnsupported = "This terminal doesn't support raw mode.";
      const soCFSetupWontWork =
        "CFSetup uses raw mode to read user input and write output to the terminal, and won't function correctly without it.";
      const tryRunningItIn = 'Try running your previous command in a terminal that supports raw mode';
      const oneOfThese =
        currentPlatform === 'win32'
          ? ', such as Command Prompt or Powershell.'
          : currentPlatform === 'darwin'
            ? ', such as Terminal.app or iTerm.'
            : '.'; // linux user detected, hand holding disengaged.

      logger.error(`${thisTerminalIsUnsupported}\n${soCFSetupWontWork}\n${tryRunningItIn}${oneOfThese}`);
    }
  }
}

/**
 * The main entrypoint for the CLI.
 * main only gets called when the script is run directly, not when it's imported as a module.
 */
// @ts-expect-error
if (typeof jest === 'undefined' && require.main === module) {
  main(hideBin(process.argv)).catch(e => {
    // The logging of any error that was thrown from `main()` is handled in the `yargs.fail()` handler.
    // Here we just want to ensure that the process exits with a non-zero code.
    // We don't want to do this inside the `main()` function, since that would kill the process when running our tests.
    const exitCode = (e instanceof FatalError && e.code) || 1;
    process.exit(exitCode);
  });
}
