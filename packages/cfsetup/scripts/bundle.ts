import type { BuildOptions } from 'esbuild';

import path from 'node:path';
import process from 'node:process';
import { build, context } from 'esbuild';
import copy from 'esbuild-plugin-copy';

import { EXTERNAL_DEPENDENCIES } from './deps';

const run = async () => {
  const watchMode = process.argv.includes('--watch');
  const outDir = path.resolve('./dist');
  const cfSetupPkgDir = path.resolve('.');
  const __RELATIVE_PACKAGE_PATH__ = `"${path.relative(outDir, cfSetupPkgDir)}"`;

  const options: BuildOptions = {
    keepNames: true,
    entryPoints: ['./src/cli.ts'],
    bundle: true,
    outdir: outDir,
    platform: 'node',
    format: 'cjs',
    external: EXTERNAL_DEPENDENCIES,
    sourcemap: process.env.SOURCEMAPS !== 'false',
    inject: [path.join(__dirname, '../import_meta_url.js')],
    // This is required to support jsonc-parser. See https://github.com/microsoft/node-jsonc-parser/issues/57
    mainFields: ['module', 'main'],
    define: {
      __RELATIVE_PACKAGE_PATH__,
      'import.meta.url': 'import_meta_url',
      'process.env.NODE_ENV': `'${process.env.NODE_ENV || 'production'}'`
    },
    plugins: [
      copy({
        resolveFrom: 'cwd',
        assets: {
          from: ['node_modules/better-sqlite3/build/Release/**/*'],
          to: ['./Release']
        }
      })
    ]
  };

  const runBuild = async () => {
    await build(options);
  };

  const runWatch = async () => {
    const ctx = await context(options);
    await ctx.watch();
    console.log('Watching...');
  };

  if (watchMode) {
    await runWatch();
  } else {
    await runBuild();
  }
};

run().catch(error => {
  console.error(error);
  process.exit(1);
});
