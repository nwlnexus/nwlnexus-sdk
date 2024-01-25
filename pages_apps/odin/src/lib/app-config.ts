type AppConfig = {
  name: string;
  url?: string;
  ogImage?: string;
  description: string;
  links: Record<string, string>;
  keywords: string[];
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
  defaultWeatherOptions: {
    q: string;
    days: number;
    alerts: 'yes' | 'no';
  };
  navMenu: Array<NavItem> | [];
  pagesThatDontNeedSidebar: string[];
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
  appThemes: ['cupcake', 'sunset', 'business', 'night'],
  appDefaultTheme: 'sunset',
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
  pagesThatDontNeedSidebar: ['/', '/about']
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
