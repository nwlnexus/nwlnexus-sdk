<script lang="ts">
  import { page } from '$app/stores';
  import { Logo } from '$components';
  import { cn } from '$utils';

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
      aria-label="odinUI"
      class="mr-6 flex items-center transition-opacity hover:opacity-75"
      data-sveltekit-preload-data
    >
      <Logo />
    </a>
  </div>

  <div class="flex flex-1 items-center justify-between space-x-2 sm:space-x-4 md:justify-end">
    <div class="w-full flex-1 md:w-auto md:flex-none">
      <!-- Search/CMDK here eventually -->
    </div>
  </div>
  <nav class="flex items-center text-sm font-semibold leading-6">
    <!-- Nav menu -->

    <div class="flex items-center gap-6 border-neutral-700 text-neutral-400 sm:ml-6 sm:pl-6 md:border-l"></div>
  </nav>
</div>
