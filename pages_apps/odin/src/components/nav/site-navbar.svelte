<script lang="ts">
  import type { WeatherData } from '$components/weather/types';

  import { page } from '$app/stores';
  import { GitHub, Logo, Weather } from '$components';
  import { MobileNav } from '$components/nav';
  import { ThemeSwitch } from '$components/theme-switch';
  import { appConfig } from '$lib/app-config';
  import { cn } from '$utils';
  import { mode } from 'mode-watcher';

  export let wData: WeatherData | undefined = undefined;

  $: isRoot = $page.url.pathname === '/';
</script>

<div
  class={cn(
    'container flex h-14 items-center rounded-md bg-neutral-800 text-white !outline outline-2 !outline-neutral-700 dark:!outline-none',
    isRoot && '!outline-0 md:bg-transparent'
  )}
>
  <div class="flex">
    <a
      href="/"
      aria-label={appConfig.name}
      class="mr-6 flex items-center transition-opacity hover:opacity-75"
      data-sveltekit-preload-data
    >
      <Logo class="h-5" withText textColor={$mode === 'light' ? 'black' : 'white'} />
    </a>
  </div>

  <div class="flex flex-1 items-center justify-between space-x-2 sm:space-x-4 md:justify-end">
    <div class="w-full flex-1 md:w-auto md:flex-none">
      <!-- Search/CMDK here eventually -->
      {#if wData}
        <Weather data={wData} size="sm" class="mr-4" />
      {/if}
    </div>
  </div>
  <nav class="flex items-center text-sm font-semibold leading-6">
    <!-- Nav menu -->
    <ul class="hidden space-x-8 md:flex">
      {#each appConfig.navMenu as navItem}
        <li>
          <a href={navItem.href} class="transition-colors hover:text-magnum-500">
            {navItem.title}
          </a>
        </li>
      {/each}
    </ul>
    <div class="flex items-center gap-6 border-neutral-700 text-neutral-400 sm:ml-6 sm:pl-6 md:border-l">
      <a
        href={appConfig.links.github}
        target="_blank"
        rel="noopener noreferrer"
        class="transition-colors hover:text-neutral-50"
      >
        <GitHub class="h-5 w-5" />
        <span class="sr-only">View the {appConfig.name} GitHub Repository</span>
      </a>
      <ThemeSwitch />
      <MobileNav />
    </div>
  </nav>
</div>
