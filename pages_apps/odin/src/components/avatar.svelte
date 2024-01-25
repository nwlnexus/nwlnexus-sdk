<script lang="ts">
  import { createAvatar, melt } from '@melt-ui/svelte';

  export let profileImg = '';
  export let user: string | null | undefined = undefined;

  let computedInitials = '';

  if (user && user.length > 0 && user.split(' ').length > 1) {
    computedInitials =
      (user.split(' ')[0].at(0)?.toUpperCase() ?? '') + (user.split(' ')[1].at(0)?.toUpperCase() ?? '');
  }
  if (user && user.length > 0 && user.split(' ').length <= 1) {
    computedInitials = user.at(0)?.toUpperCase() ?? '';
  }

  const {
    elements: { image, fallback }
  } = createAvatar({
    src: profileImg
  });
</script>

<div class="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
  <img use:melt={$image} alt="Avatar" class="h-full w-full rounded-[inherit]" />
  <span use:melt={$fallback} class="text-lg font-medium text-magnum-700">{computedInitials}</span>
</div>
