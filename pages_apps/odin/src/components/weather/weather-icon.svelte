<script lang="ts">
  import { setContext } from 'svelte';
  import {
    DayCloudy,
    DayFog,
    DayShowers,
    DaySnow,
    DaySunny,
    DaySunnyOvercast,
    NightAltCloudyHigh,
    NightAltPartlyCloudy,
    NightAltRain,
    NightAltShowers,
    NightAltSnow,
    NightClear,
    NightFog,
    Rain
  } from 'svelte-weather';

  export let code: number = 1000;
  export let size: 'lg' | 'sm' = 'lg';
  export let is_day = false;

  const iconCtx = {
    size: size == 'lg' ? '96' : '48'
  };
  setContext('iconCtx', iconCtx);

  type AppIcontype = typeof DaySunny;

  const dayOptions = new Map<number, AppIcontype>();
  dayOptions.set(1000, DaySunny);
  dayOptions.set(1003, DayCloudy);
  dayOptions.set(1006, DayCloudy);
  dayOptions.set(1009, DaySunnyOvercast);
  dayOptions.set(1030, DayFog);
  dayOptions.set(1063, DayShowers);
  dayOptions.set(1066, DaySnow);
  dayOptions.set(1183, Rain);
  dayOptions.set(1135, DayFog);
  dayOptions.set(1213, DaySnow);
  dayOptions.set(1147, DayFog);
  dayOptions.set(1210, DaySnow);

  const nightOptions = new Map<number, AppIcontype>();
  nightOptions.set(1000, NightClear);
  nightOptions.set(1003, NightAltPartlyCloudy);
  nightOptions.set(1006, NightAltPartlyCloudy);
  nightOptions.set(1009, NightAltCloudyHigh);
  nightOptions.set(1030, NightFog);
  nightOptions.set(1063, NightAltShowers);
  nightOptions.set(1066, NightAltSnow);
  nightOptions.set(1183, NightAltRain);
  nightOptions.set(1135, NightFog);
  nightOptions.set(1213, NightAltSnow);
  nightOptions.set(1147, NightFog);
  nightOptions.set(1210, NightAltSnow);
</script>

{#if is_day}
  <svelte:component this={dayOptions.get(code)} />
{:else}
  <svelte:component this={nightOptions.get(code)} />
{/if}
