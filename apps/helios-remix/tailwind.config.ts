import type { Config } from 'tailwindcss';

const config = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', '../../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('flowbite/plugin')]
} satisfies Config;
export default config;
