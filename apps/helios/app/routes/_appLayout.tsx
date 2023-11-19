import { isRouteErrorResponse, Link, NavLink, Outlet, useLoaderData, useRouteError } from '@remix-run/react';
import { useCallback, useState } from 'react';
import { Drawer } from 'react-daisyui';
import { defer, redirect } from '@remix-run/cloudflare';
import AppMenu from '~/components/ui/AppMenu';
import NavBar from '~/components/ui/NavBar';
import { DEFAULTOPTIONS } from '~/components/WeatherData/weather-funcs';
import { appConfig } from '~/config/app.config';
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
  return (
    <>
      <Drawer
        open={visible}
        onClickOverlay={toggleVisible}
        className="bg-base-100"
        aria-label="Menu"
        side={
          <>
            <AppMenu />
          </>
        }
      >
        <NavBar toggleVisible={toggleVisible} version={version} apiKey={apiKey} weatherData={weatherData} user={user} />
        <Outlet />
      </Drawer>
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
      <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold">{status_code}</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{status_msg}</h1>
          <p className="mt-6 text-base leading-7">{msg}</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <NavLink to="/" className="btn btn-accent px-3.5 py-2.5 text-sm font-semibold shadow-sm">
              Go back home
            </NavLink>
            <Link to="/support" className="btn btn-neutral text-sm font-semibold">
              Contact support <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
