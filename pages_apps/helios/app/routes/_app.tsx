import type { WeatherData } from '@components/WeatherData';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import type { SessionConfig } from '@services/sessions.server';

import { isRouteErrorResponse, Outlet, useLoaderData, useLocation, useRouteError } from '@remix-run/react';
import { useCallback, useEffect, useState } from 'react';
import { Button, Hero } from 'react-daisyui';
import { defer, redirect } from '@remix-run/cloudflare';
import { AppState, createAppState } from '@providers/AppState';

import { getIPAddress } from '@app/utils';
import { DEFAULTOPTIONS } from '@components/WeatherData/weather-funcs';
import { appConfig } from '@config/app.config';
import useMediaQuery from '@hooks/useMediaQuery';
import { getAuthenticator } from '@services/auth.server';
import { appSessionStorage } from '@services/sessions.server';
import { Drawer } from '@components/ui/drawer';

declare global {
  interface Array<T> {
    matchPattern(inputString: T): boolean;
  }
}

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const req = request.clone();
  const { pathname } = new URL(req.url);
  const sessionConfig: SessionConfig = {
    kv: context.env.KV,
    node_env: context.env.NODE_ENV,
    secrets: context.env.AUTH_SECRET.split(','),
    tag: appConfig.cookieTag
  };
  const apiKey = context.env.WEATHERAPI_KEY;
  const ipAddress = await getIPAddress(req, context);
  const { days, alerts } = Object.assign(DEFAULTOPTIONS, {});
  const weatherDataPromise = fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${ipAddress}&days=${days}&aqi=no&alerts=${alerts}`
  );
  const sessionStorage = await appSessionStorage(sessionConfig);
  const authenticator = await getAuthenticator(context, sessionStorage);
  const user = await authenticator.isAuthenticated(req);

  if (!user && !appConfig.publicPages.includes(pathname)) {
    return redirect('/auth/login');
  }

  return defer({
    version: context.env.APP_VERSION,
    apiKey,
    user: user,
    weatherData: weatherDataPromise.then(res => res.json<WeatherData>())
  });
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const { version, apiKey, weatherData, user } = useLoaderData<typeof loader>();
  const [visible, setVisible] = useState(false);
  const toggleVisible = useCallback(() => {
    setVisible(visible => !visible);
  }, []);

  const { device } = useMediaQuery();

  useEffect(() => {
    document.documentElement.style.scrollPaddingTop = '5rem';
    document.documentElement.style.scrollBehavior = 'smooth';
  }, [pathname]);

  // eslint-disable-next-line no-extend-native
  Array.prototype.matchPattern = function (inputString) {
    for (const pattern of this) {
      const regexPattern = pattern.replace(/\*/g, '.*');
      const regex = new RegExp(`^${regexPattern}$`);

      if (regex.test(inputString)) {
        return true;
      }
    }

    return false;
  };

  return (
    <>
      <AppState.Provider value={createAppState()}>
        <Drawer open={visible}>
          <Outlet />
        </Drawer>
      </AppState.Provider>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let status_code: number = 0;
  let status_msg: string = '';
  let msg: string = '';

  if (isRouteErrorResponse(error)) {
    status_code = error.status;
    status_msg = error.statusText;
    msg = error.data;
  }
  return (
    <>
      <Hero className='not-prose min-h-screen'>
        <Hero.Content>
          <div className='max-w-md'>
            <h1 className='mb-5 text-5xl font-bold opacity-10 lg:text-7xl xl:text-9xl'>{status_code} Error!</h1>
            <p className='mb-5'> {status_msg}</p>
            <p className='mb-5'>{msg}</p>
          </div>
          <Button tag='a' href={'/'}>
            Go Back
          </Button>
        </Hero.Content>
      </Hero>
    </>
  );
}
