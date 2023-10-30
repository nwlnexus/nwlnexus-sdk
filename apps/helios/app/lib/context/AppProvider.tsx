import React, { createContext, useContext, useState } from 'react';
import { siteConfig } from '~/lib/config/site-config';
import type { WeatherCardData } from '~/lib/components/shared/weather-types';
import type { SiteConfig } from '~/lib/config/site-config';
import type { PropsWithChildren } from 'react';

type AppContextProps = {
  config: SiteConfig;
  weatherData: WeatherCardData | null;
  setWeatherData: React.Dispatch<React.SetStateAction<WeatherCardData | null>>;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
};

type AppProviderProps = {};

const AppContext = createContext<AppContextProps>(undefined!);
export function AppProvider({ children }: PropsWithChildren<AppProviderProps>) {
  const [config, setConfig] = useState<SiteConfig>(siteConfig);
  const [weatherData, setWeatherData] = useState<WeatherCardData | null>(null);

  return (
    <AppContext.Provider
      value={{
        config,
        weatherData,
        setWeatherData,
        setConfig
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextProps {
  const context = useContext(AppContext);
  if (typeof context === 'undefined') {
    throw new Error('useAppContext should be used within the AppContext provider!');
  }

  return context;
}
