// Settings here should be considered Global ESLint settings for the monorepo. We don't need to define --config in each package.
// https://eslint.org/docs/latest/use/configure/
// https://eslint.org/docs/latest/use/configure/configuration-files#using-configuration-files
// This can be in the form of a .eslintrc.* file or an eslintConfig field in a package.json file,
// both of which ESLint will look for and read automatically, or you can specify a configuration file on the command line.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    browser: true,
    worker: true,
    node: true
  },
  extends: ['@remix-run/eslint-config', '@remix-run/eslint-config/node', 'turbo', 'prettier'],
  ignorePatterns: [
    '**/node_modules/**',
    'examples',
    '**/templates/**',
    '.*.js',
    '.*.cjs',
    '**/dist/**',
    'public/build/**'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: true
  },
  plugins: ['unused-imports', 'no-only-tests'],
  rules: {
    '@typescript-eslint/consistent-type-imports': ['error'],
    '@typescript-eslint/no-unused-vars': 'off',
    'no-empty-function': 'off',
    'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    'no-only-tests/no-only-tests': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }
    ]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
