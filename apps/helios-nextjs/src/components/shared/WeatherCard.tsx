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
import type { ReactElement } from 'react';
import type { WeatherCardData } from './weather-types';

export function WeatherCard({ weatherData }: { weatherData: WeatherCardData }) {
  let precipIndicator;
  let weatherIcon: ReactElement;
  const code = weatherData.w.current.condition.code;
  const is_day = weatherData.w.current.is_day === 1;

  // TODO: Add in remaining weather icons by code
  if (code === 1000 && is_day) {
    weatherIcon = <WiDaySunny size={108} />;
  } else if (code == 1000 && !is_day) {
    weatherIcon = <WiNightClear size={108} />;
  } else if (code == 1003 && is_day) {
    weatherIcon = <WiDayCloudy size={108} />;
  } else if (code == 1003 && !is_day) {
    weatherIcon = <WiNightAltPartlyCloudy size={108} />;
  } else if (code == 1006 && is_day) {
    weatherIcon = <WiDayCloudy size={108} />;
  } else if (code == 1006 && !is_day) {
    weatherIcon = <WiNightAltCloudy size={108} />;
  } else if (code == 1009 && is_day) {
    weatherIcon = <WiDaySunnyOvercast size={108} />;
  } else if (code == 1009 && !is_day) {
    weatherIcon = <WiNightCloudyHigh size={108} />;
  } else if (code == 1030 && is_day) {
    weatherIcon = <WiDayHaze size={108} />;
  } else if (code == 1030 && !is_day) {
    weatherIcon = <WiNightFog size={108} />;
  } else if (code == 1063 && is_day) {
    weatherIcon = <WiDayShowers size={108} />;
  } else if (code == 1063 && !is_day) {
    weatherIcon = <WiNightAltShowers size={108} />;
  } else if (code == 1066 && is_day) {
    weatherIcon = <WiDaySnow size={108} />;
  } else if (code == 1066 && !is_day) {
    weatherIcon = <WiNightAltSnow size={108} />;
  } else if (code == 1183) {
    weatherIcon = <WiRain size={108} />;
  } else if ((code == 1030 || code == 1135) && is_day) {
    weatherIcon = <WiDayFog size={108} />;
  } else if ((code == 1030 || code == 1135) && !is_day) {
    weatherIcon = <WiNightFog size={108} />;
  } else {
    weatherIcon = <p></p>;
    console.log(code);
  }

  if (weatherData.w.forecast.forecastday[0].day.daily_will_it_rain === 1) {
    precipIndicator = (
      <>
        <WiRain size="24" />
        {weatherData.w.forecast.forecastday[0].day.daily_chance_of_rain}%
      </>
    );
  } else if (weatherData.w.forecast.forecastday[0].day.daily_will_it_snow === 1) {
    precipIndicator = (
      <>
        <WiSnow size="24" />
        {weatherData.w.forecast.forecastday[0].day.daily_chance_of_snow}%
      </>
    );
  }

  return (
    <>
      <div className="w-full p-2 md:p-4">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-7xl font-bold">{weatherData.w.current.temp_f}&deg;</span>
            <span className="mt-1 font-semibold text-gray-500">
              {weatherData.w.location.name}, {weatherData.w.location.region}
            </span>
          </div>
          <div className="grid grid-cols-2 items-center justify-end">
            <span className="col-span-1 justify-self-start">{weatherIcon}</span>
            <div className="col-span-1 flex flex-col items-end">
              <span className="items-center text-sm">{weatherData.w.forecast.forecastday[0].day.condition.text}</span>
              <span className="items-center text-xs font-semibold lg:text-sm">
                H: {weatherData.w.forecast.forecastday[0].day.maxtemp_f}
                &deg; L: {weatherData.w.forecast.forecastday[0].day.mintemp_f}
                &deg;
              </span>
              <span className="ml-1 mt-1 flex items-center text-sm font-semibold">
                <WiHumidity size="24" />
                {weatherData.w.forecast.forecastday[0].day.avghumidity}
              </span>
              <span className="ml-1 mt-1 flex items-center text-sm font-semibold">
                <WiWindy size="24" />
                {weatherData.w.forecast.forecastday[0].day.maxwind_mph}
              </span>
              <span className="ml-1 flex items-center text-sm font-semibold">{precipIndicator}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-end text-sm">
          <h5>
            Powered by{' '}
            <a rel="noreferrer" target="_blank" href="https://www.weatherapi.com/" title="Weather API">
              WeatherAPI.com
            </a>
          </h5>
        </div>
      </div>
    </>
  );
}
