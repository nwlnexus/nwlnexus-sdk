import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    environment: 'node',
    setupFiles: ['src/__tests__/vitest.setup.ts'],
    coverage: {
      provider: 'istanbul'
    }
  }
});
