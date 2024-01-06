import { describe, expect, suite, test } from 'vitest';

import { endEventLoop } from './helpers/end-event-loop';
import { mockConsoleMethods } from './helpers/mock-console';
import { runCfsetup } from './helpers/run-cfsetup';

suite('cfsetup', async () => {
  const std = mockConsoleMethods();

  describe('no command', () => {
    test('should display a list of commands', async () => {
      await runCfsetup();

      expect(std.out).toMatchInlineSnapshot(`
        "cfsetup

        Commands:
          cfsetup init     ✨ Create local repository project
          cfsetup dump     ✨ Dump current environment variables and parsed files
          cfsetup prepare  🥣 Prepare local development environment
          cfsetup reset    💥 Reset local Cloudflare Storage assets
          cfsetup pages    ⚡️ Manage CF Pages Project
          cfsetup deploy   🚀 Deploy local project

        Flags:
          -j, --experimental-json-config  Experimental: Support wrangler.json  [boolean]
          -w, --wrangler-config           Path to .toml configuration file  [string]
              --debug                     Debug mode  [boolean]
          -h, --help                      Show help  [boolean]
          -v, --version                   Show version number  [boolean]"
      `);

      expect(std.err).toMatchInlineSnapshot(`""`);
    });
  });

  describe('invalid command', () => {
    test('should display an error', async () => {
      await expect(runCfsetup('invalid-command')).resolves.toThrowErrorMatchingInlineSnapshot(`undefined`);
      expect(std.out).toMatchInlineSnapshot(`
        "
        cfsetup

        Commands:
          cfsetup init     ✨ Create local repository project
          cfsetup dump     ✨ Dump current environment variables and parsed files
          cfsetup prepare  🥣 Prepare local development environment
          cfsetup reset    💥 Reset local Cloudflare Storage assets
          cfsetup pages    ⚡️ Manage CF Pages Project
          cfsetup deploy   🚀 Deploy local project

        Flags:
          -j, --experimental-json-config  Experimental: Support wrangler.json  [boolean]
          -w, --wrangler-config           Path to .toml configuration file  [string]
              --debug                     Debug mode  [boolean]
          -h, --help                      Show help  [boolean]
          -v, --version                   Show version number  [boolean]"
      `);

      expect(std.err).toMatchInlineSnapshot(`
			        "[31mX [41;31m[[41;97mERROR[41;31m][0m [1mUnknown argument: invalid-command[0m

			        "
		      `);
    });
  });

  describe('subcommand implicit help ran on incomplete command execution', () => {
    test("no subcommand for 'pages' should display a list of available subcommands", async () => {
      await runCfsetup('pages');
      await endEventLoop();

      expect(std.out).toMatchInlineSnapshot(`
        "cfsetup pages

        ⚡️ Manage CF Pages Project

        Commands:
          cfsetup pages project     ⚡️ Interact with your Pages projects
          cfsetup pages deployment  🚀 Interact with the deployments of a project

        Flags:
          -j, --experimental-json-config  Experimental: Support wrangler.json  [boolean]
          -w, --wrangler-config           Path to .toml configuration file  [string]
              --debug                     Debug mode  [boolean]
          -h, --help                      Show help  [boolean]
          -v, --version                   Show version number  [boolean]"
      `);
    });

    test("no subcommand for 'prepare' should display a list of available subcommands", async () => {
      await runCfsetup('prepare');
      await endEventLoop();

      expect(std.out).toMatchInlineSnapshot(`
      "cfsetup prepare

      🥣 Prepare local development environment

      Commands:
        cfsetup prepare all  Prepare all CF assets
        cfsetup prepare d1   Prepare D1 Database
        cfsetup prepare kv   Prepare KV Namespace
        cfsetup prepare r2   Prepare R2 Bucket

      Flags:
        -j, --experimental-json-config  Experimental: Support wrangler.json  [boolean]
        -w, --wrangler-config           Path to .toml configuration file  [string]
            --debug                     Debug mode  [boolean]
        -h, --help                      Show help  [boolean]
        -v, --version                   Show version number  [boolean]"
  `);
    });
  });
});
