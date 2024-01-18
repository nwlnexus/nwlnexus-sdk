import type { LayoutServerLoad } from './$types';

import { DEFAULTOPTIONS } from '$components/weather';

export const load: LayoutServerLoad = async ({ platform, getClientAddress }) => {
  console.log(platform);
  const apiKey = platform?.env.WEATHERAPI_KEY;
  console.log(apiKey);
  const ipAddress = getClientAddress();
  console.log(ipAddress);
  const { days, alerts } = Object.assign(DEFAULTOPTIONS, {});

  const res_weatherData = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${ipAddress}&days=${days}&aqi=no&alerts=${alerts}`
  );
  const weatherData = await res_weatherData.json();

  return {
    weatherData
  };
};
