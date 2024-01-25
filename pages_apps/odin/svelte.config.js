import { mdsvex } from '@huntabyte/mdsvex';
import { preprocessMeltUI, sequence } from '@melt-ui/pp';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import { mdsvexOptions } from './mdsvex.config.js';

// import pkg from './package.json' assert { type: 'json' };

/** @type {import('@sveltejs/kit').Config}*/
const config = {
  extensions: ['.svelte', '.md', '.svx'],
  preprocess: sequence([mdsvex(mdsvexOptions), vitePreprocess(), preprocessMeltUI()]),
  kit: {
    adapter: adapter(),
    alias: {
      $components: 'src/components',
      $utils: 'src/utils'
    },
    csrf: {
      checkOrigin: process.env.NODE_ENV !== 'development'
    }
    // env: {
    //   privatePrefix: (pkg.name.startsWith('@') ? pkg.name.split('/')[1] : pkg.name).toUpperCase() + '_'
    // },
    // typescript: {
    //   config: config => {
    //     return {
    //       compilerOptions: {
    //         ...config.compilerOptions,
    //         baseUrl: '.',
    //         paths: {
    //           ...config.compilerOptions.paths
    //         }
    //       }
    //     };
    //   }
    // }
  },
  vitePlugin: {
    inspector: true
  }
};
export default config;
