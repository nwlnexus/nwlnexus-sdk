/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';

export default defineConfig({
  resolve: {
    alias: {
      '~/types': fileURLToPath(new URL('./types', import.meta.url)),
      '~': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    include: ['./tests/*.{spec.ts,spec.js}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      provider: 'c8',
      exclude: ['node_modules/']
    },
    environment: 'miniflare',
    environmentOptions: {
      modules: true,
      scriptPath: './dist/index.mjs'
    },
    passWithNoTests: true
  }
});
