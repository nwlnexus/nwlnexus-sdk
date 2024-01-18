<!--suppress ReservedWordAsName -->
<script lang="ts">
  import type { CurrentElement, DayElement, LocationElement } from './types';

  import { default as WeatherIcon } from './weather-icon.svelte';

  let className = '';
  export { className as class };
  export let location: LocationElement;
  export let day: DayElement;
  export let current: CurrentElement;
</script>

<div class={className} {...$$restProps}>
  <div class="flex flex-row space-x-2 px-2">
    <div class="flex items-center justify-center">
      <span class="h-12 w-12"
        ><WeatherIcon is_day={Boolean(current.is_day)} code={current.condition.code} size="sm" /></span
      >
    </div>
    <div class="grid grid-rows-2 items-center justify-end">
      <div class="row-span-1 flex flex-col items-end text-xs font-thin">
        <span>{location.name}</span>
      </div>
      <div class="row-span-1 flex flex-col items-end text-xs font-thin">
        <div class="flex flex-row space-x-2">
          <span>
            Today: <span class="text-accent">{Math.round(current.temp_f)}&deg;F</span>
          </span>
          <span>
            {Math.round(day.maxtemp_f)}&deg;F/
            {Math.round(day.mintemp_f)}&deg;F
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
