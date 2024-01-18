<!--suppress ReservedWordAsName -->
<script lang="ts">
  import type { WeatherData } from './types';

  import { twMerge } from 'tailwind-merge';

  import { formatDate, getNextHours } from './index';
  import { default as WeatherBanner } from './weather-banner.svelte';
  import { default as WeatherCard } from './weather-card.svelte';

  let className = '';
  export { className as class };
  export let size: 'lg' | 'sm' = 'lg';
  export let data: WeatherData;

  const wData = {
    w: data,
    h: getNextHours(data, formatDate())
  };

  $: todayForecast = wData.w.forecast.forecastday[0];
  $: current = wData.w.current;
</script>

{#if size === 'sm'}
  <WeatherBanner class={twMerge(className)} location={wData.w.location} {current} day={todayForecast.day} />
{:else}
  <WeatherCard class={twMerge(className)} location={wData.w.location} day={todayForecast.day} {current} />
{/if}
