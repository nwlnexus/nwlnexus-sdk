import type { LayoutServerLoad } from './$types';

import { dev } from '$app/environment';
import { DEFAULTOPTIONS } from '$components/weather';
// @ts-expect-error Unsure why
import { env } from '$env/dynamic/private';

export const load: LayoutServerLoad = async ({ platform, getClientAddress }) => {
  const apiKey = dev ? env.WEATHERAPI_KEY : platform?.env.WEATHERAPI_KEY;
  const ipAddress = getClientAddress();
  const { days, alerts } = Object.assign(DEFAULTOPTIONS, {});

  const res_weatherData = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${ipAddress}&days=${days}&aqi=no&alerts=${alerts}`
  );
  const weatherData = await res_weatherData.json();

  return {
    weatherData
  };
};
