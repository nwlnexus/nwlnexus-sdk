import type { HourElement, WeatherData } from './types';

const DEFAULTOPTIONS = {
  alerts: 'no',
  days: 3,
  q: '10001'
};
const getNextHours = (w: WeatherData, d: string, n = 5): HourElement[] | [] => {
  return w.forecast.forecastday[0].hour.filter((el) => Date.parse(el.time) > Date.parse(d)).slice(0, n);
};

const formatDate = () => {
  let d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(
    2,
    '0'
  )} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export { DEFAULTOPTIONS, getNextHours, formatDate };
