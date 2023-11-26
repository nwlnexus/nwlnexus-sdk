import chalk from 'chalk';
import child_process from 'node:child_process';

export const setupDB = async (binding: string, schemaDir: string, migrationsDir: string, persistTo: string) => {
  console.info(chalk.blue(`Preparing to setup D1 Database: ${binding}`));
  // const schema = path.normalize(schemaDir);
  console.log(schemaDir);
  // const outDir = path.normalize(`${migrationsDir}`);
  const cmd = `drizzle-kit generate:sqlite --schema=${schemaDir} --out=${migrationsDir}`;
  child_process.execSync(cmd, {
    stdio: 'inherit',
    encoding: 'utf8'
  });
  const wranglerCmd = `NO_D1_WARNING=true wrangler d1 migrations apply ${binding} --local --persist-to=${persistTo}`;
  child_process.execSync(wranglerCmd, {
    stdio: 'inherit',
    encoding: 'utf8'
  });
  console.info(chalk.blue(`Completed setup of D1 Database: ${binding}`));
};
