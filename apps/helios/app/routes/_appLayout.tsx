import { Outlet, useLoaderData } from '@remix-run/react';
import { useCallback, useState } from 'react';
import { Drawer } from 'react-daisyui';
import { defer, redirect } from '@remix-run/cloudflare';
import NavBar from '~/components/ui/NavBar';
import { appConfig } from '~/config/app.config';
import { getAuthenticator } from '~/services/auth.server';
import { appSessionStorage } from '~/services/session.server';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import type { WeatherData } from '~/components/WeatherData';
import type { SessionConfig } from '~/services/session.server';

const DEFAULTOPTIONS = {
  alerts: 'no',
  days: 3,
  q: '10001'
};

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
  const { q, days, alerts } = Object.assign(DEFAULTOPTIONS, {});
  const weatherDataPromise = fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${q}&days=${days}&aqi=no&alerts=${alerts}`
  );
  const sessionStorage = await appSessionStorage(sessionConfig);
  const authenticator = await getAuthenticator(context, sessionStorage);
  const user = await authenticator.isAuthenticated(req);
  if (!user && !appConfig.publicPages.includes(pathname)) {
    redirect('/auth/login');
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
      <Drawer open={visible} onClickOverlay={toggleVisible} className="bg-base-100" aria-label="Menu" side={<></>}>
        <NavBar toggleVisible={toggleVisible} version={version} apiKey={apiKey} weatherData={weatherData} user={user} />
        <Outlet />
      </Drawer>
    </>
  );
}
