<!--suppress ReservedWordAsName -->
<script lang="ts">
  import type { Writable } from 'svelte/store';

  import { page } from '$app/stores';
  import { buttonVariants } from '$components';
  import { cn } from '$utils';

  export let href: string;
  export let open: Writable<boolean>;

  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<a
  {href}
  on:click={() => open.set(false)}
  class={cn(buttonVariants({ variant: 'ghost' }), 'justify-start', className)}
  {...$$restProps}
  data-active={$page.url.pathname === href}
>
  <slot />
</a>
