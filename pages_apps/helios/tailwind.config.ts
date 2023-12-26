import defaultTheme from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';
import { appConfig } from './app/config/app.config';

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
  daisyui: {
    themes: appConfig.appThemes,
    darkTheme: 'sunset',
    base: true,
    styled: true,
    utils: true,
    log: false
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animate'),
    require('tailwindcss-3d'),
    require('daisyui')
  ]
} satisfies Config;
export default config;
