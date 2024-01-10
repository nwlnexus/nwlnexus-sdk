import type { ReactNode } from 'react';

type AppConfig = {
  appThemes: (
    | 'light'
    | 'dark'
    | 'cupcake'
    | 'bumblebee'
    | 'emerald'
    | 'corporate'
    | 'synthwave'
    | 'retro'
    | 'cyberpunk'
    | 'valentine'
    | 'halloween'
    | 'garden'
    | 'forest'
    | 'aqua'
    | 'lofi'
    | 'pastel'
    | 'fantasy'
    | 'wireframe'
    | 'black'
    | 'luxury'
    | 'dracula'
    | 'cmyk'
    | 'autumn'
    | 'business'
    | 'acid'
    | 'lemonade'
    | 'night'
    | 'coffee'
    | 'winter'
    | 'dim'
    | 'nord'
    | 'sunset'
  )[];
  appDefaultTheme: string;
  cookieTag: string;
  defaultWeatherOptions: {
    q: string;
    days: number;
    alerts: 'yes' | 'no';
  };
  navMenu: Array<NavItem> | [];
  pagesThatDontNeedSidebar: string[];
  publicPages: string[];
};

const config = {
  appThemes: ['cupcake', 'sunset', 'business', 'night'],
  appDefaultTheme: 'sunset',
  cookieTag: '__helios_session',
  defaultWeatherOptions: {
    alerts: 'yes',
    days: 4,
    q: '21076'
  },
  navMenu: [
    {
      href: '/dashboard',
      title: 'Dashboard',
      description: ''
    },
    {
      href: '/nodes',
      title: 'Nodes',
      description: ''
    },
    {
      href: '/media',
      title: 'Media',
      description: ''
    }
  ],
  pagesThatDontNeedSidebar: ['/', '/about'],
  publicPages: ['/', '/about']
} satisfies AppConfig;

interface NavItem {
  href: string;
  title: string;
  description: string;
  hasSidebar?: boolean;
  subMenu?: NavItem[];
  icon?: ReactNode;
}

export { config as appConfig, type AppConfig };
