<script lang="ts">
  import '@fontsource-variable/fira-code';
  import '../app.postcss';

  import { page } from '$app/stores';
  import { SiteNavbar } from '$components';
  import { cn } from '$utils';
  import { ModeWatcher } from 'mode-watcher';

  $: isRoot = $page.url.pathname === '/';
</script>

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
    <SiteNavbar />
  </header>
</div>
