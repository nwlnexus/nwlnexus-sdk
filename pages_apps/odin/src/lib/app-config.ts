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
  publicPages: string[];
};

const config = {
  name: 'Odin UI',
  url: '',
  ogImage: 'https://melt-ui.com/og.jpg',
  description:
    'An open-source collection of accessible & customizable component builders for creating user interfaces with Svelte.',
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
  icon?: Element;
}

export { config as appConfig, type AppConfig };
