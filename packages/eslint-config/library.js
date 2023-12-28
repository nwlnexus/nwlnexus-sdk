/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    node: true
  },
  extends: ['eslint:recommended', 'prettier', 'eslint-config-turbo'],
  globals: {
    React: true,
    JSX: true
  },
  ignorePatterns: [
    // Ignore dotfiles
    '.*.js',
    'node_modules/',
    'dist/',
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
  plugins: ['@typescript-eslint', 'only-warn'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }
    ]
  }
};
