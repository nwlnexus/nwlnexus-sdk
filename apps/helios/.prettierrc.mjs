const config = {
  useTabs: false,
  singleQuote: true,
  trailingComma: 'none',
  printWidth: 120,
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx'],
  importOrder: [
    '<BUILTIN_MODULES>',
    'react',
    '@remix-run/react',
    '@remix-run/.*',
    'clsx',
    '',
    '<THIRD_PARTY_MODULES>',
    '<TYPES>',
    '<TYPES>^[.]',
    '',
    '^[.]',
    '^(?!.*[.]css$)[./].*$',
    '.css$'
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0'
};

export default config;
