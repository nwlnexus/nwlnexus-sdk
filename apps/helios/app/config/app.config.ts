import type { ReactNode } from 'react';

type AppConfig = {
  appThemes: Array<string>;
  appDefaultTheme: string;
  cookieTag: string;
  defaultWeatherOptions: {
    q: string;
    days: number;
    alerts: 'yes' | 'no';
  };
  navMenu: Array<NavItem> | [];
  publicPages: string[];
};

const config = {
  appThemes: ['cupcake', 'dark', 'business', 'night', 'sunset'],
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
      description: '',
      hasSidebar: false
    },
    {
      href: '/nodes',
      title: 'Nodes',
      description: '',
      hasSidebar: false
    },
    {
      href: '/media',
      title: 'Media',
      description: '',
      hasSidebar: false
    }
  ],
  publicPages: ['/', '/about']
} satisfies AppConfig;

interface NavItem {
  href: string;
  title: string;
  description: string;
  hasSidebar: boolean;
  icon?: ReactNode;
}

export { config as appConfig, type AppConfig };
