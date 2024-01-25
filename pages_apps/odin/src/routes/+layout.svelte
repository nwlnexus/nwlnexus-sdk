<script lang="ts">
  import '@fontsource-variable/fira-code';
  import '../app.postcss';

  import type { LayoutData } from './$types';

  import { page } from '$app/stores';
  import { SiteNavbar } from '$components/nav';
  import { appConfig } from '$lib/app-config';
  import { cn } from '$utils';
  import { ModeWatcher } from 'mode-watcher';
  import { MetaTags } from 'svelte-meta-tags';

  export let data: LayoutData;
  $: isRoot = $page.url.pathname === '/';
  $: metaTags = {
    titleTemplate: `${appConfig.name} | %s`,
    description: appConfig.description,
    canonical: appConfig.url,
    robots: 'noindex,nofollow',
    additionalRobotsProps: { noarchive: true },
    keywords: appConfig.keywords,
    ...$page.data.metaTagsChild // Override with child page meta tags if they exist.
  };
</script>

<MetaTags {...metaTags} />
<ModeWatcher defaultMode={'dark'} />

<div class="flex relative min-h-screen flex-col md:flex-col-reverse" id="page">
  <div class="flex flex-1">
    <slot />
  </div>
  <header
    class={cn(
      'sticky bottom-0 z-40 w-full px-2 pb-2 md:bottom-[none] md:top-0 md:pb-0 md:pt-2',
      !isRoot && 'bg-neutral-900'
    )}
  >
    <SiteNavbar wData={data.weatherData} />
  </header>
</div>
