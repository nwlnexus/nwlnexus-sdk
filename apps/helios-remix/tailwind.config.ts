import type { Config } from 'tailwindcss';

const config = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', '../../node_modules/daisyui/dist/**/*.js'],
  theme: {
    extend: {}
  },
  daisyui: {
    themes: ['cmyk', 'dark', 'dracula', 'night'],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    log: false
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('daisyui')]
} satisfies Config;
export default config;
