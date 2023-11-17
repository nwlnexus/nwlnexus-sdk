import { useEffect, useState } from 'react';
import type { HourElement, WeatherData } from './types';

const DEFAULTOPTIONS = {
  alerts: 'no',
  days: 3,
  q: '10001'
};

type WeatherDataProps = {
  apiKey: string;
  options?: {
    alerts: string;
    days: number;
    q: string;
  };
};

const getNextHours = (w: WeatherData, d: string, n = 5): HourElement[] | [] => {
  return w.forecast.forecastday[0].hour.filter((el) => Date.parse(el.time) > Date.parse(d)).slice(0, n);
};

const useWeatherData = ({ apiKey, options = DEFAULTOPTIONS }: WeatherDataProps) => {
  const opts = Object.assign(DEFAULTOPTIONS, options);
  const { q, days, alerts } = opts;
  const [wData, setWData] = useState<{ w: WeatherData; h: HourElement[] | [] }>();

  useEffect(() => {
    let d = new Date();
    let formatted_d = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(
      2,
      '0'
    )} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

    const getWeatherData = async (apiKey: string, q: string, days: number, alerts: string) => {
      const data = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${q}&days=${days}&aqi=no&alerts=${alerts}`
      );
      const json = await data.json<WeatherData>();
      setWData({
        w: json,
        h: getNextHours(json, formatted_d)
      });
    };

    getWeatherData(apiKey, q, days, alerts).catch(console.error);
  }, [apiKey, q, days, alerts]);

  return wData;
};

export { useWeatherData, type WeatherDataProps };
