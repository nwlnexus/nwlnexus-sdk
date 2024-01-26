import type { EntryGenerator, PageLoad } from './$types';

import { appConfig } from '$lib/app-config';
import { getDoc } from '$lib/utils';

export const entries: EntryGenerator = () => {
  return appConfig.docsMenu.map(item => {
    return { slug: item.title.toLowerCase().replaceAll(' ', '-') };
  });
};

export const load: PageLoad = async ({ params, data }) => {
  const doc = await getDoc(params.slug);

  return {
    component: doc.default,
    metadata: doc.metadata,
    title: doc.metadata.title,
    ...data
  };
};
