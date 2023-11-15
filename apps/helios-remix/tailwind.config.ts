import defaultTheme from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

const config = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    '../../node_modules/daisyui/dist/**/*.js',
    '../../node_modules/react-daisyui/dist/**/*.js'
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', ...defaultTheme.fontFamily.sans]
    },
    extend: {}
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('daisyui')]
} satisfies Config;
export default config;
