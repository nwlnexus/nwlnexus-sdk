/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@nwlnexus/eslint-config/cfworker'],
  overrides: [
    {
      files: ['src/**/*.ts'],
      excludedFiles: '*.test.ts',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: true
      }
    }
  ]
};
