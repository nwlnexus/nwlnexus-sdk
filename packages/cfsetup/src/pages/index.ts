import { RootArgumentsArgv } from '../root-arguments';
import * as Deployments from './deployments';
import * as Projects from './projects';

export function pages(args: RootArgumentsArgv) {
  return args
    .command('project', '⚡️ Interact with your Pages projects', yargs =>
      yargs
        .command('list', 'List CF Pages projects', Projects.ListOptions)
        .command('create [project-name]', 'Create a new CF Pages project', Projects.CreateOptions)
        .command('delete [project-name]', 'Delete a CF Pages project', Projects.DeleteOptions, Projects.DeleteHandler)
    )
    .command('deployment', '🚀 Interact with the deployments of a project', yargs =>
      yargs.command('list', 'List deployments in your Cloudflare Pages project', Deployments.ListOptions)
    );
}

/**
 *     .option('account-id', {
 *       type: 'string',
 *       alias: ['id'],
 *       demandOption: true,
 *       description: `Cloudflare Account ID. Can be parsed from ${env_prefix}_ACCOUNT_ID environment variable if it exists.`,
 *       nargs: 1,
 *       requiresArg: true
 *     })
 *     .option('api-token', {
 *       type: 'string',
 *       alias: ['token'],
 *       demandOption: false,
 *       description: `Cloudflare API Token.Can be parsed from ${env_prefix}_API_TOKEN environment variable if it exists.`,
 *       nargs: 1,
 *       requiresArg: true,
 *       conflicts: ['api-key', 'api-email']
 *     })
 *     .option('api-email', {
 *       type: 'string',
 *       alias: ['email'],
 *       demandOption: false,
 *       description: `Cloudflare account email.Can be parsed from ${env_prefix}_API_EMAIL environment variable if it exists.`,
 *       nargs: 1,
 *       requiresArg: true,
 *       implies: ['apiKey'],
 *       conflicts: ['api-token']
 *     })
 *     .option('api-key', {
 *       type: 'string',
 *       alias: ['key'],
 *       demandOption: false,
 *       description: `Cloudflare API global key.Can be parsed from ${env_prefix}_API_KEY environment variable if it exists.`,
 *       nargs: 1,
 *       requiresArg: true,
 *       implies: ['apiEmail'],
 *       conflicts: ['api-token']
 *     })
 *     .option('name', {
 *       type: 'string',
 *       description: 'Name for Cloudflare Project.',
 *       nargs: 1,
 *       requiresArg: true
 *     })
 *     .option('project-type', {
 *       type: 'string',
 *       description: 'Cloudflare Pages project type.',
 *       default: 'remix',
 *       nargs: 1,
 *       requiresArg: true
 *     })
 *     .option('custom-domain', {
 *       type: 'string',
 *       description: 'Custom Domain for the project.',
 *       nargs: 1,
 *       requiresArg: true
 *     })
 *     .check((args) => {
 *       if ((args.operation == 'create' || args.operation == 'delete') && typeof args.name == 'undefined') {
 *         throw new Error(`--name is required when using operation: ${args.operation}`);
 *       } else {
 *         return true;
 *       }
 *     }, false);
 */
