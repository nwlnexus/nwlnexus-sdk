// Settings here should be considered Global ESLint settings for the monorepo. We don't need to define --config in each package.
// https://eslint.org/docs/latest/use/configure/
// https://eslint.org/docs/latest/use/configure/configuration-files#using-configuration-files
// This can be in the form of a .eslintrc.* file or an eslintConfig field in a package.json file,
// both of which ESLint will look for and read automatically, or you can specify a configuration file on the command line.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ['**/node_modules/**', 'examples', '**/templates/**', '.eslintrc.js', '**/dist/**'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  plugins: ['@typescript-eslint', 'import', 'no-only-tests', 'eslint-plugin-react', 'eslint-plugin-react-hooks'],
  extends: ['turbo'],
  env: {
    browser: true,
    worker: true,
    node: true
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'turbo',
        'prettier'
      ],
      rules: {
        'no-empty': 'off',
        'no-empty-function': 'off',
        'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
        'no-only-tests/no-only-tests': 'error',
        'no-shadow': 'error',
        'require-yield': 'off',
        '@typescript-eslint/consistent-type-imports': ['error'],
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
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
    }
  ]
};
