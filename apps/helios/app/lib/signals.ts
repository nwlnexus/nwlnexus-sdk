import { signal } from '@preact/signals-react';
import { siteConfig } from '~/lib/config/site-config';
import type { Signal } from '@preact/signals-react';
import type { WeatherCardData } from '~/lib/components/shared/weather-types';
import type { SiteConfig } from '~/lib/config/site-config';

export const config: Signal<SiteConfig> = signal(siteConfig);
export const weatherData: Signal<WeatherCardData | null> = signal(null);
