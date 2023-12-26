/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['eslint:recommended', 'prettier', 'eslint-config-turbo'],
  plugins: ['@typescript-eslint', 'only-warn'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: true
  },
  globals: {
    React: true,
    JSX: true
  },
  env: {
    node: true
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
    // 'no-restricted-globals': [
    //   'error',
    //   {
    //     name: '__dirname',
    //     message: 'Use `getBasePath()` instead.'
    //   },
    //   {
    //     name: '__filename',
    //     message: 'Use `getBasePath()` instead.'
    //   }
    // ]
  }
};
