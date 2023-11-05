import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../node_modules/daisyui/dist/**/*.js',
    '../../node_modules/react-daisyui/dist/**/*.js'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  daisyui: {
    themes: ['light', 'dark', 'synthwave', 'corporate', 'black', 'dracula', 'night', 'valentine', 'pastel', 'cmyk'],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    log: false
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('daisyui')]
};
export default config;
