import * as prepare from './prepare.js';
import * as reset from './reset.js';
import { CommandModule } from 'yargs';

//@ts-expect-error Typing is not sufficient but it works
export const commands: CommandModule<unknown, unknown>[] = [prepare, reset];
