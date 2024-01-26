type AppConfig = {
  name: string;
  url?: string;
  ogImage?: string;
  description: string;
  links: Record<string, string>;
  keywords: string[];
  defaultWeatherOptions: {
    q: string;
    days: number;
    alerts: 'yes' | 'no';
  };
  navMenu: NavItem[] | [];
  docsMenu: NavItem[] | [];
};

const config: AppConfig = {
  name: 'Odin UI',
  url: 'https://app.nwlnexus.xyz',
  ogImage: 'https://melt-ui.com/og.jpg',
  description: 'An open-source system management application.',
  links: {
    github: 'https://github.com/nwlnexus/nwlnexus-sdk?tab=readme-ov-file#readme'
  },
  keywords: ['odinui', 'svelte', 'sveltekit'],
  defaultWeatherOptions: {
    alerts: 'yes',
    days: 4,
    q: '21076'
  },
  navMenu: [
    {
      href: '/locations',
      title: 'Locations',
      description: 'Location management'
    },
    {
      href: '/nodes',
      title: 'Nodes',
      description: 'Node management'
    },
    {
      href: '/media',
      title: 'Media',
      description: 'Media management'
    },
    {
      href: '/settings',
      title: 'Settings',
      description: 'Settings management'
    },
    {
      href: '/docs',
      title: 'Docs',
      description: 'Documentation',
      isPublic: true
    }
  ],
  docsMenu: [
    {
      title: 'Introduction',
      description: '',
      href: '/docs/introduction'
    }
  ]
};

interface NavItem {
  href: string;
  title: string;
  description: string;
  hasSidebar?: boolean;
  subMenu?: NavItem[];
  isPublic?: boolean;
  icon?: Element;
}

export { config as appConfig, type AppConfig };
