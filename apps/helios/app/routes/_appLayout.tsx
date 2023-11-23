import { isRouteErrorResponse, Outlet, useLoaderData, useRouteError } from '@remix-run/react';
import { useCallback, useEffect, useState } from 'react';
import { Button, Drawer, Hero } from 'react-daisyui';
import { defer, redirect } from '@remix-run/cloudflare';
import AppMenu from '~/components/ui/AppMenu';
import NavBar from '~/components/ui/NavBar';
import { DEFAULTOPTIONS } from '~/components/WeatherData/weather-funcs';
import { appConfig } from '~/config/app.config';
import { AppState, createAppState } from '~/providers/AppState';
import { AppThemeProvider } from '~/providers/AppThemeProvider';
import { getAuthenticator } from '~/services/auth.server';
import { appSessionStorage } from '~/services/session.server';
import { getIPAddress } from '~/utils';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import type { WeatherData } from '~/components/WeatherData';
import type { SessionConfig } from '~/services/session.server';

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
    weatherData: weatherDataPromise.then((res) => res.json<WeatherData>())
  });
};

export default function AppLayout() {
  const { version, apiKey, weatherData, user } = useLoaderData<typeof loader>();
  const [visible, setVisible] = useState(false);
  const toggleVisible = useCallback(() => {
    setVisible((visible) => !visible);
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollPaddingTop = '5rem';
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <>
      <AppThemeProvider>
        <AppState.Provider value={createAppState()}>
          <Drawer
            className="bg-base-100"
            open={visible}
            onClickOverlay={toggleVisible}
            sideClassName="z-40"
            side={
              <aside className="min-h-screen w-56 bg-base-100 p-4">
                <AppMenu responsive={false} vertical={true} toggleVisible={toggleVisible} version={version} />
                <div className="pointer-events-none sticky bottom-0 flex h-40 bg-base-100 [mask-image:linear-gradient(transparent,#000000)]" />
              </aside>
            }
          >
            <div>
              <NavBar
                toggleVisible={toggleVisible}
                version={version}
                apiKey={apiKey}
                weatherData={weatherData}
                user={user}
              />
              <Outlet />
            </div>
          </Drawer>
        </AppState.Provider>
      </AppThemeProvider>
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
      <Hero className="not-prose min-h-screen">
        <Hero.Content>
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold opacity-10 lg:text-7xl xl:text-9xl">{status_code} Error!</h1>
            <p className="mb-5"> {status_msg}</p>
            <p className="mb-5">{msg}</p>
          </div>
          <Button tag="a" href={'/'}>
            Go Back
          </Button>
        </Hero.Content>
      </Hero>
    </>
  );
}
