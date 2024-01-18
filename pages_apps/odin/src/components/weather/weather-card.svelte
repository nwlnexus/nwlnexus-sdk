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
  <div class="flex justify-between">
    <div class="flex flex-col">
      <span class="text-7xl font-bold">{Math.round(current.temp_f)}&deg;F</span>
      <span class="mt-1 font-semibold text-gray-500">
        {location.name}, {location.region}
      </span>
    </div>
    <div class="grid grid-cols-2 items-center justify-end">
      <span class="col-span-1 justify-self-start"
        ><WeatherIcon is_day={Boolean(current.is_day)} code={current.condition.code} size="lg" /></span
      >
      <div class="col-span-1 flex flex-col items-end">
        <span class="items-center text-sm">{day.condition.text}</span>
        <span class="items-center text-xs font-semibold lg:text-sm">
          H: {Math.round(day.maxtemp_f)}
          &deg;F L: {Math.round(day.mintemp_f)}
          &deg;F
        </span>
        <span class="ml-1 mt-1 flex items-center text-sm font-semibold">
          <WiHumidity size="24" />
          {Math.round(day.avghumidity)}
        </span>
        <span class="ml-1 mt-1 flex items-center text-sm font-semibold">
          <WiWindy size="24" />
          {Math.round(day.maxwind_mph)}
        </span>
        <span class="ml-1 flex items-center text-sm font-semibold">{precipIndicator}</span>
      </div>
    </div>
  </div>
  <div class="mt-4 flex items-baseline justify-end text-sm">
    <h5>
      Powered by{' '}
      <a rel="noreferrer" target="_blank" href="https://www.weatherapi.com/" title="Weather API"> WeatherAPI.com </a>
    </h5>
  </div>
</div>
