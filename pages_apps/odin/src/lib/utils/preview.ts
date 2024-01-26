import type { DocResolver } from '$lib/types';

import { error } from '@sveltejs/kit';

function slugFromPath(path: string) {
  return path.replace('/md/content/', '').replace('.md', '');
}
export async function getDoc(slug: string) {
  const modules = import.meta.glob('/src/docs/content/**/*.md');

  let match: { path?: string; resolver?: DocResolver } = {};

  for (const [path, resolver] of Object.entries(modules)) {
    if (slugFromPath(path) === slug) {
      match = { path, resolver: resolver as unknown as DocResolver };
      break;
    }
  }

  const doc = await match?.resolver?.();

  if (!doc || !doc.metadata) {
    throw error(404);
  }
  return doc;
}
