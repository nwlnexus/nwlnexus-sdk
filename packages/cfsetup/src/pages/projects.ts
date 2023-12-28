import { confirm } from '../dialogs';
import { logger } from '../logger';
import { CommonYargsArgv, StrictYargsOptionsToInterface } from '../root-arguments';

export function ListOptions(yargs: CommonYargsArgv) {
  return yargs;
}
export function CreateOptions(yargs: CommonYargsArgv) {
  return yargs
    .positional('project-name', {
      type: 'string',
      demandOption: true,
      description: 'The name of your Pages project'
    })
    .option('production-branch', {
      type: 'string',
      description: 'The name of the production branch of your project'
    })
    .option('compatibility-flags', {
      describe: 'Flags to use for compatibility checks',
      alias: 'compatibility-flag',
      type: 'string',
      requiresArg: true,
      array: true
    })
    .option('compatibility-date', {
      describe: 'Date to use for compatibility checks',
      type: 'string',
      nargs: 1,
      requiresArg: true
    });
}
export function DeleteOptions(yargs: CommonYargsArgv) {
  return yargs
    .positional('project-name', {
      type: 'string',
      demandOption: true,
      description: 'The name of your Pages project'
    })
    .options({
      yes: {
        alias: 'y',
        type: 'boolean',
        description: 'Answer "yes" to confirm project deletion'
      }
    });
}

export async function DeleteHandler(args: StrictYargsOptionsToInterface<typeof DeleteOptions>) {
  const confirmed =
    args.yes || (await confirm(`Are you sure you want to delete "${args.projectName}"? This action cannot be undone.`));

  if (confirmed) {
    logger.log('Deleting', args.projectName);
    // await fetchResult(`/accounts/${accountId}/pages/projects/${args.projectName}`, { method: 'DELETE' });

    logger.log('Successfully deleted', args.projectName);
  }
}
