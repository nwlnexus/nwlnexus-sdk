<script lang="ts">
  import { page } from '$app/stores';

  $: isDashboard = $page.url.pathname === '/dashboard';
</script>

<div class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6">
  {#if !isDashboard}
    <aside
      class="fixed top-16 z-30 -mr-2 hidden h-[calc(100vh-4rem)] w-full shrink-0
		flex-col overflow-y-auto pb-2 md:sticky md:flex md:order-last"
    ></aside>
  {/if}
  <div class="mx-auto w-full min-w-0">
    <slot />
  </div>
</div>
