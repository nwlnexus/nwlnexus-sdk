<script lang="ts">
  import { createDialog, melt } from '@melt-ui/svelte';
  import { Button, Logo } from '$components';
  import { MobileNavLink } from '$components/nav';
  import { appConfig } from '$lib/app-config';
  import { Menu, X } from 'lucide-svelte';
  import { mode } from 'mode-watcher';
  import { writable } from 'svelte/store';
  import { fade, fly } from 'svelte/transition';

  const open = writable(false);
  const {
    elements: { trigger, overlay, content, close, portalled }
  } = createDialog({ open });
</script>

<button use:melt={$trigger} class="text-neutral-400 transition-colors hover:text-neutral-50 md:hidden">
  <Menu class="square-6" />
  <span class="sr-only">Toggle Menu</span>
</button>

<div use:melt={$portalled} class="md:hidden">
  {#if $open}
    <div
      use:melt={$overlay}
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
      transition:fade={{ duration: 150 }}
    />
    <div
      use:melt={$content}
      class="menu safe-area fixed bottom-0 z-50 h-2/3 w-full bg-neutral-900 px-2
				 pt-6 shadow-lg focus:outline-none"
      transition:fly={{ y: 768, duration: 300, opacity: 1 }}
    >
      <div class="flex items-center justify-between">
        <MobileNavLink href="/" {open}>
          <Logo class="h-5" withText textColor={$mode === 'light' ? 'black' : 'white'} />
        </MobileNavLink>
        <Button class="px-2" size="sm" variant="faded" {...$close} action={$close.action}>
          <X class="square-4" />
        </Button>
      </div>

      <div class="flex flex-col">
        {#each appConfig.navMenu as navItem, index (navItem + index.toString())}
          {#if navItem.href}
            <MobileNavLink href={navItem.href} {open}>
              {navItem.title}
            </MobileNavLink>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .menu,
  .menu :global(*) {
    @apply !ring-0;
  }

  .safe-area {
    padding-bottom: calc(6.5rem + env(safe-area-inset-bottom));
  }
</style>
