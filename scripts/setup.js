#!/usr/bin/env node
import child_process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import chalk from 'chalk';
import toml from 'toml';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

const setupDB = async (binding, schemaDir, migrationDir) => {
  console.info(chalk.blue(`Preparing to setup D1 Database: ${binding}`));
  const schema = path.normalize(schemaDir + '/' + binding.toLowerCase() + '.ts');
  const outDir = path.normalize(`${migrationDir}`);
  const cmd = `node_modules/.bin/drizzle-kit generate:sqlite --schema=${schema} --out=${outDir}`;
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

const setupKV = async b => {
  console.info(chalk.blue(`Preparing to setup KV: ${b}`));
};

const setupR2 = async b => {
  console.info(chalk.blue(`Preparing to setup R2: ${b}`));
};

const parser = yargs(hideBin(process.argv))
  .options({
    'wrangler-file': {
      description: 'Path to custom wrangler TOML file.',
      alias: ['w'],
      default: path.join(process.cwd(), 'wrangler.toml'),
      demandOption: true,
      type: 'string'
    }
  })
  .check(argv => {
    let fileExists = false;

    try {
      fs.accessSync(argv['wrangler-file']);
      fileExists = true;
    } catch (e) {
      throw e;
    }
    return fileExists;
  })
  .command(
    'prepare',
    'Prepare local Cloudflare assets.',
    yargs => {
      return yargs.options({
        'schema-dir': {
          alias: 's',
          description: 'Directory to source schemas from.',
          demandOption: true,
          requiresArg: true,
          type: 'string'
        }
      });
    },
    async argv => {
      const wranglerCfg = toml.parse(fs.readFileSync(argv.wranglerFile, 'utf-8'));
      if ('d1_databases' in wranglerCfg) {
        for (const database of wranglerCfg.d1_databases) {
          await setupDB(database.binding, argv.schemaDir, database.migrations_dir);
        }
      }
      if ('kv_namespaces' in wranglerCfg) {
        for (const kv of wranglerCfg.kv_namespaces) {
          await setupKV(kv.binding);
        }
      }
      if ('r2_namespaces' in wranglerCfg) {
        for (const r2 of wranglerCfg.r2_namespaces) {
          await setupR2(r2.binding);
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
  await parser.parse();
})();
