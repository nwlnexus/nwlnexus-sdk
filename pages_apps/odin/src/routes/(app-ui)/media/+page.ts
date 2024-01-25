import type { MetaTagsProps } from 'svelte-meta-tags';

import { appConfig } from '$lib/app-config';

export const load = async ({ url }) => {
  const navItem = appConfig.navMenu.find(i => i.href == url.pathname);

  const metaTags: MetaTagsProps = Object.freeze({
    title: navItem?.title ?? '',
    description: navItem?.description ?? '',
    openGraph: {
      // OpenGraph meta tags specific to this page.
      type: 'website',
      url: new URL(url.pathname, url.origin).href,
      locale: 'en_IE',
      title: 'Open Graph Title',
      description: 'Open Graph Description'
    }
  });

  return {
    metaTagsChild: metaTags // Return meta tags, so they can be consumed by layout.svelte.
  };
};
