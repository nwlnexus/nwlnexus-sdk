import type { Config } from 'tailwindcss';

const config = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    '../../node_modules/daisyui/dist/**/*.js',
    '../../node_modules/react-daisyui/dist/**/*.js'
  ],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('daisyui')]
} satisfies Config;
export default config;
