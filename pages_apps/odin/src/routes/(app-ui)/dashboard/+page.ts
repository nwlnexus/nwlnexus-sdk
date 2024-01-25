import type { MetaTagsProps } from 'svelte-meta-tags';

export const load = async ({ url }) => {
  const metaTags: MetaTagsProps = Object.freeze({
    title: 'Dashboard',
    description: 'System dashboard',
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
