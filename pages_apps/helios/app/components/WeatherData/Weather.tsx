import type { ReactNode } from 'react';
import type { WeatherIconProp, WeatherProps } from './types';

import {
  WiDayCloudy,
  WiDayFog,
  WiDayHaze,
  WiDayShowers,
  WiDaySnow,
  WiDaySunny,
  WiDaySunnyOvercast,
  WiHumidity,
  WiNightAltCloudy,
  WiNightAltPartlyCloudy,
  WiNightAltShowers,
  WiNightAltSnow,
  WiNightClear,
  WiNightCloudyHigh,
  WiNightFog,
  WiRain,
  WiSnow,
  WiWindy
} from 'react-icons/wi';
import { twMerge } from 'tailwind-merge';

import { formatDate, getNextHours } from './weather-funcs';

const weatherIcon = ({ code, size = 'lg', is_day }: WeatherIconProp) => {
  const iSize = size == 'lg' ? '108' : '56';
  if (code === 1000 && is_day) {
    return <WiDaySunny size={iSize} />;
  } else if (code == 1000 && !is_day) {
    return <WiNightClear size={iSize} />;
  } else if (code == 1003 && is_day) {
    return <WiDayCloudy size={iSize} />;
  } else if (code == 1003 && !is_day) {
    return <WiNightAltPartlyCloudy size={iSize} />;
  } else if (code == 1006 && is_day) {
    return <WiDayCloudy size={iSize} />;
  } else if (code == 1006 && !is_day) {
    return <WiNightAltCloudy size={iSize} />;
  } else if (code == 1009 && is_day) {
    return <WiDaySunnyOvercast size={iSize} />;
  } else if (code == 1009 && !is_day) {
    return <WiNightCloudyHigh size={iSize} />;
  } else if (code == 1030 && is_day) {
    return <WiDayHaze size={iSize} />;
  } else if (code == 1030 && !is_day) {
    return <WiNightFog size={iSize} />;
  } else if (code == 1063 && is_day) {
    return <WiDayShowers size={iSize} />;
  } else if (code == 1063 && !is_day) {
    return <WiNightAltShowers size={iSize} />;
  } else if (code == 1066 && is_day) {
    return <WiDaySnow size={iSize} />;
  } else if (code == 1066 && !is_day) {
    return <WiNightAltSnow size={iSize} />;
  } else if (code == 1183) {
    return <WiRain size={iSize} />;
  } else if ((code == 1030 || code == 1135) && is_day) {
    return <WiDayFog size={iSize} />;
  } else if ((code == 1030 || code == 1135) && !is_day) {
    return <WiNightFog size={iSize} />;
  }
};
const Weather = ({ size = 'lg', className, data, ...props }: WeatherProps): ReactNode => {
  const wData = {
    w: data,
    h: getNextHours(data, formatDate())
  };
  if (typeof wData == 'undefined') return <></>;
  const code = wData.w.current.condition.code;
  const is_day = wData.w.current.is_day === 1;
  const classes = twMerge(className);
  const todayForecast = wData.w.forecast.forecastday[0]!;

  if (size == 'sm') {
    return (
      <div {...props} className={classes}>
        <div className='flex flex-row space-x-2 px-2'>
          <div className='flex items-center justify-center'>
            <span className='h-12 w-12'>{weatherIcon({ code, is_day, size })}</span>
          </div>
          <div className='grid grid-rows-2 items-center justify-end'>
            <div className='row-span-1 flex flex-col items-end text-xs font-thin'>
              <span>{wData.w.location.name}</span>
            </div>
            <div className='row-span-1 flex flex-col items-end text-xs font-thin'>
              <div className='flex flex-row space-x-2'>
                <span>
                  Today: <span className='text-accent'>{Math.round(wData.w.current.temp_f)}&deg;F</span>
                </span>
                <span>
                  {Math.round(todayForecast.day.maxtemp_f)}&deg;F/
                  {Math.round(todayForecast.day.mintemp_f)}&deg;F
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  let precipIndicator;
  if (todayForecast.day.daily_will_it_rain === 1) {
    precipIndicator = (
      <>
        <WiRain size='24' />
        {todayForecast.day.daily_chance_of_rain}%
      </>
    );
  } else if (todayForecast.day.daily_will_it_snow === 1) {
    precipIndicator = (
      <>
        <WiSnow size='24' />
        {todayForecast.day.daily_chance_of_snow}%
      </>
    );
  }
  return (
    <div {...props} className={classes}>
      <div className='flex justify-between'>
        <div className='flex flex-col'>
          <span className='text-7xl font-bold'>{Math.round(wData.w.current.temp_f)}&deg;F</span>
          <span className='mt-1 font-semibold text-gray-500'>
            {wData.w.location.name}, {wData.w.location.region}
          </span>
        </div>
        <div className='grid grid-cols-2 items-center justify-end'>
          <span className='col-span-1 justify-self-start'>{weatherIcon({ code, is_day, size })}</span>
          <div className='col-span-1 flex flex-col items-end'>
            <span className='items-center text-sm'>{todayForecast.day.condition.text}</span>
            <span className='items-center text-xs font-semibold lg:text-sm'>
              H: {Math.round(todayForecast.day.maxtemp_f)}
              &deg;F L: {Math.round(todayForecast.day.mintemp_f)}
              &deg;F
            </span>
            <span className='ml-1 mt-1 flex items-center text-sm font-semibold'>
              <WiHumidity size='24' />
              {Math.round(todayForecast.day.avghumidity)}
            </span>
            <span className='ml-1 mt-1 flex items-center text-sm font-semibold'>
              <WiWindy size='24' />
              {Math.round(todayForecast.day.maxwind_mph)}
            </span>
            <span className='ml-1 flex items-center text-sm font-semibold'>{precipIndicator}</span>
          </div>
        </div>
      </div>
      <div className='mt-4 flex items-baseline justify-end text-sm'>
        <h5>
          Powered by{' '}
          <a rel='noreferrer' target='_blank' href='https://www.weatherapi.com/' title='Weather API'>
            WeatherAPI.com
          </a>
        </h5>
      </div>
    </div>
  );
};
export default Weather;
