import type { ReactNode } from 'react';

type SiteConfig = {
  defaultMode: 'light' | 'dark';
  defaultWeatherOptions: {
    q: string;
    days: number;
    alerts: 'yes' | 'no';
  };
  navMenu: NavItem[];
  toolsMenu: NavItem[];
};

interface NavItem {
  href: string;
  title: string;
  description: string;
  icon?: ReactNode;
}
const siteConfig: SiteConfig = {
  defaultMode: 'dark',
  defaultWeatherOptions: {
    q: '21076',
    days: 4,
    alerts: 'yes'
  },
  navMenu: [
    {
      href: '/admin/locations',
      title: 'Locations',
      description: 'Location details'
    },
    {
      href: '/admin/nodes',
      title: 'Nodes',
      description: 'Edge node details'
    }
  ],
  toolsMenu: [
    {
      href: '/admin/messages',
      title: 'Messaging',
      description: 'Messaging administration'
    },
    {
      href: '/admin/potool',
      title: 'PO Tool',
      description: 'Purchase Order administration'
    },
    {
      href: '/admin/settings',
      title: 'Settings',
      description: 'ODIN settings administration'
    }
  ]
};

// type DefaultNavItemValues = Pick<NavItem, 'hasSidebar'>;
// const defaultNavItemValues: DefaultNavItemValues = {
//   hasSidebar: false
// };
// type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export { siteConfig, type SiteConfig };
