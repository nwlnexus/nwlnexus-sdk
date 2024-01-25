<script lang="ts">
  import { signOut } from '@auth/sveltekit/client';
  import { createDropdownMenu, melt } from '@melt-ui/svelte';
  import { Avatar, ToolTip } from '$components';
  import { flyAndScale } from '$utils';

  export let user: string | null | undefined = undefined;
  export let profileImg = '';

  const {
    elements: { menu, item, trigger, separator, arrow },
    states: { open }
  } = createDropdownMenu();
</script>

<ToolTip text="User menu">
  <button use:melt={$trigger} data-open={$open ? '' : undefined} aria-label="Open user menu">
    <Avatar {user} {profileImg} />
    <span class="sr-only">Open user menu</span>
  </button>
</ToolTip>

{#if open}
  <div
    use:melt={$menu}
    class="z-50 flex w-32 flex-col rounded-md bg-neutral-700 px-1 py-1 shadow-sm shadow-neutral-800"
    transition:flyAndScale={{
      duration: 150,
      y: 0,
      start: 0.96
    }}
  >
    <div use:melt={$arrow} />
    <div class="separator" use:melt={$separator} />
    <div
      class="item"
      use:melt={$item}
      on:m-click={() => {
        signOut();
      }}
    >
      Logout
    </div>
  </div>
{/if}
