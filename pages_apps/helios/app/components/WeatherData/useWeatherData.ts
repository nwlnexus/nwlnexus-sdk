import { useEffect, useState } from 'react';
import type { HourElement, WeatherData, WeatherDataProps } from './types';
import { DEFAULTOPTIONS, formatDate, getNextHours } from './weather-funcs';

const useWeatherData = ({ apiKey, options = DEFAULTOPTIONS }: WeatherDataProps) => {
  const { q, days, alerts } = Object.assign(DEFAULTOPTIONS, options);
  const [wData, setWData] = useState<{ w: WeatherData; h: HourElement[] | [] }>();

  useEffect(() => {
    const getWeatherData = async (apiKey: string, q: string, days: number, alerts: string) => {
      const data = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${q}&days=${days}&aqi=no&alerts=${alerts}`
      );
      const json = await data.json<WeatherData>();
      setWData({
        w: json,
        h: getNextHours(json, formatDate())
      });
    };

    getWeatherData(apiKey, q, days, alerts).catch(console.error);
  }, [apiKey, q, days, alerts]);

  return wData;
};

export { useWeatherData };
