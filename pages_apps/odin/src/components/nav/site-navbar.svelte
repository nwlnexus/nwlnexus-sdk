<script lang="ts">
  import type { WeatherData } from '$components/weather/types';

  import { signIn } from '@auth/sveltekit/client';
  import { dev } from '$app/environment';
  import { page } from '$app/stores';
  import { Button, GitHub, Logo, ThemeSwitch, Weather } from '$components';
  import { MobileNav, UserMenu } from '$components/nav';
  import { appConfig } from '$lib/app-config';
  import { cn } from '$utils';
  import { mode } from 'mode-watcher';

  export let wData: WeatherData | undefined = undefined;

  $: isRoot = $page.url.pathname === '/';
  $: isDashboard = $page.url.pathname === '/dashboard';
</script>

<div
  class={cn(
    'container flex h-14 items-center rounded-md bg-neutral-800 text-white !outline outline-2 !outline-neutral-700 dark:!outline-none',
    isRoot && '!outline-0 md:bg-transparent'
  )}
>
  <div class="flex">
    <a
      href={$page.data.session ? '/dashboard' : '/'}
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
      {#if wData && !isDashboard}
        <Weather data={wData} size="sm" class="mr-4" />
      {/if}
    </div>
  </div>
  <nav class="flex items-center text-sm font-semibold leading-6 md:divide-neutral-700 md:divide-x sm:pl-6">
    <!-- Protected Nav menu -->
    {#if $page.data.session}
      <ul class="hidden space-x-8 md:flex">
        {#each appConfig.navMenu as { href, title, isPublic }}
          {#if !isPublic}
            <li>
              <a {href} class="transition-colors hover:text-magnum-500">
                {title}
              </a>
            </li>
          {/if}
        {/each}
      </ul>
    {:else}
      <Button
        size="sm"
        variant="faded"
        on:click={() => {
          signIn('auth0', {
            callbackUrl: dev
              ? 'http://localhost:8786/auth/callback/auth0'
              : 'https://app.nwlnexus.xyz/auth/callback/auth0'
          });
        }}>Login</Button
      >
    {/if}
    <div class="flex items-center sm:ml-6 sm:pl-6">
      <!-- Public Nav Menu -->
      <ul class="hidden space-x-8 md:flex">
        {#each appConfig.navMenu as { href, title, isPublic }}
          {#if isPublic}
            <li>
              <a {href} class="transition-colors hover:text-magnum-500">
                {title}
              </a>
            </li>
          {/if}
        {/each}
      </ul>
    </div>
    <div class="flex items-center gap-6 text-neutral-400 sm:ml-6 sm:pl-6">
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
      {#if $page.data.session}
        <UserMenu user={$page.data.session.user?.name} />
      {/if}
      <MobileNav />
    </div>
  </nav>
</div>
