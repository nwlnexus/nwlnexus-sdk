import { main } from '../../cli';
import * as shellquote from '../../utils/shell-quote';
import { normalizeSlashes, stripTimings } from './mock-console';

/**
 * A helper to 'run' cfsetup for tests
 */
export async function runCfsetup(cmd = '') {
  try {
    const argv = shellquote.parse(cmd);
    await main(argv);
  } catch (err) {
    if (err instanceof Error) {
      err.message = normalizeSlashes(stripTimings(err.message));
    }
    throw err;
  }
}
