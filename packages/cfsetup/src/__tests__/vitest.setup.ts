import chalk from 'chalk';
import { afterEach, vi } from 'vitest';

//turn off chalk for tests due to inconsistencies between operating systems
chalk.level = 0;

// Set `LC_ALL` to fix the language as English for the messages thrown by Yargs.
process.env.LC_ALL = 'en';

afterEach(() => {
  vi.clearAllMocks();
});
