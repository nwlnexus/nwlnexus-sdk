import child_process from 'node:child_process';

import chalk from 'chalk';

export async function setupKV(b: string) {
  console.info(chalk.blue(`Preparing to setup KV: ${b}`));
}

export async function setupR2(b: string) {
  console.info(chalk.blue(`Preparing to setup R2: ${b}`));
}

export async function setupDB(binding: string, schemaDir: string, migrationsDir: string, persistTo: string) {
  console.info(chalk.blue(`Preparing to setup D1 Database: ${binding}`));
  // const schema = path.normalize(schemaDir);
  // const outDir = path.normalize(`${migrationsDir}`);
  console.info(chalk.blue(`Preparing generate SQL...`));
  const cmd = `drizzle-kit generate:sqlite --schema=${schemaDir} --out=${migrationsDir}`;
  child_process.execSync(cmd, {
    stdio: 'inherit',
    encoding: 'utf8'
  });
  console.info(chalk.blue(`Preparing apply SQL...`));
  const wranglerCmd = `NO_D1_WARNING=true wrangler d1 migrations apply ${binding} --local --persist-to=${persistTo}`;
  child_process.execSync(wranglerCmd, {
    stdio: 'inherit',
    encoding: 'utf8'
  });
  console.info(chalk.blue(`Completed setup of D1 Database: ${binding}`));
}
