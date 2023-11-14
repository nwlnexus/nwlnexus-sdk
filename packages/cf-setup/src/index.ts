#!/usr/bin/env node
import child_process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import chalk from 'chalk';
import toml from 'toml';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

const setupDB = async (binding: string, schemaDir: string, migrationsDir: string) => {
  console.info(chalk.blue(`Preparing to setup D1 Database: ${binding}`));
  const schema = path.normalize(schemaDir + '/' + binding.toLowerCase() + '.ts');
  const outDir = path.normalize(`${migrationsDir}`);
  const cmd = `drizzle-kit generate:sqlite --schema=${schema} --out=${outDir}`;
  child_process.execSync(cmd, {
    stdio: 'inherit',
    encoding: 'utf8'
  });
  const wranglerCmd = `NO_D1_WARNING=true wrangler d1 migrations apply ${binding} --local`;
  child_process.execSync(wranglerCmd, {
    stdio: 'inherit',
    encoding: 'utf8'
  });
  console.info(chalk.blue(`Completed setup of D1 Database: ${binding}`));
};

const setupKV = async (b: string) => {
  console.info(chalk.blue(`Preparing to setup KV: ${b}`));
};

const setupR2 = async (b: string) => {
  console.info(chalk.blue(`Preparing to setup R2: ${b}`));
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const argv = yargs(hideBin(process.argv))
  .scriptName('cf-setup')
  .options({
    'wrangler-file': {
      description: 'Path to custom wrangler TOML file.',
      alias: ['w'],
      default: path.join(process.cwd(), 'wrangler.toml'),
      demandOption: true,
      type: 'string'
    }
  })
  .command(
    'prepare',
    'Prepare local Cloudflare assets.',
    (yargs) => {
      return yargs.options({
        schemaDir: {
          alias: 's',
          lomg: 'schema-dir',
          description: 'Directory to source schemas from.',
          demandOption: true,
          requiresArg: true,
          type: 'string',
          normalize: true
        },
        persistTo: {
          long: 'persist-to',
          description: 'Directory for wrangler state.',
          default: path.join(process.cwd(), './.wrangler/'),
          requiresArg: true,
          type: 'string',
          normalize: true
        }
      });
    },
    async (argv) => {
      const wranglerCfg = toml.parse(fs.readFileSync(argv.wranglerFile, 'utf-8'));
      if ('d1_databases' in wranglerCfg) {
        for (const database of wranglerCfg['d1_databases']) {
          const mDir = typeof database['migrations_dir'] == 'undefined' ? './migrations' : database['migrations_dir'];
          await setupDB(database['binding'], argv.schemaDir, mDir);
        }
      }
      if ('kv_namespaces' in wranglerCfg) {
        for (const kv of wranglerCfg['kv_namespaces']) {
          await setupKV(kv['binding']);
        }
      }
      if ('r2_namespaces' in wranglerCfg) {
        for (const r2 of wranglerCfg['r2_namespaces']) {
          await setupR2(r2['binding']);
        }
      }
    }
  )
  .wrap(120)
  .version('1.0.0')
  .showHelpOnFail(false)
  .help();

(async () => {
  console.info(chalk.yellow(`Running from: ${process.cwd()}`));
  await argv.parse();
})();
