/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['eslint:recommended', 'prettier'],
  ignorePatterns: [
    '**/node_modules/**',
    'vendor',
    '.eslintrc.js',
    '**/dist/**',
    'pages/functions/template-worker.ts',
    'templates',
    'emitted-types'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: true
  },
  overrides: [
    {
      files: ['src/**/*.ts'],
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: true
      },
      rules: {
        'no-restricted-globals': [
          'error',
          {
            name: '__dirname',
            message: 'Use `getBasePath()` instead.'
          },
          {
            name: '__filename',
            message: 'Use `getBasePath()` instead.'
          }
        ]
      }
    }
  ],
  plugins: ['@typescript-eslint']
};
