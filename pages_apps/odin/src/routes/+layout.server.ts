import type { LayoutServerLoad } from './$types';

import { DEFAULTOPTIONS } from '$components/weather';
import { WEATHERAPI_KEY } from '$env/static/private';

export const load: LayoutServerLoad = async ({ getClientAddress, url, fetch, locals }) => {
  url.pathname;
  const apiKey = WEATHERAPI_KEY;
  let ipAddress = getClientAddress();
  if (!ipAddress || ipAddress === '::1' || ipAddress === '127.0.0.1') {
    const q = await fetch('https://api.ipify.org?format=json');
    const { ip } = await q.json();
    ipAddress = ip;
  }
  const { days, alerts } = Object.assign({}, DEFAULTOPTIONS);

  const res_weatherData = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${ipAddress}&days=${days}&aqi=no&alerts=${alerts}`
  );

  return {
    weatherData: await res_weatherData.json(),
    session: locals.session
  };
};