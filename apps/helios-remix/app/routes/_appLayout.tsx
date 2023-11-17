import { Outlet, useLoaderData } from '@remix-run/react';
import { useCallback, useState } from 'react';
import { Drawer } from 'react-daisyui';
import { json } from '@remix-run/cloudflare';
import NavBar from '~/components/ui/NavBar';
import { appConfig } from '~/config/app.config';
import { getAuthenticator } from '~/services/auth.server';
import { appSessionStorage } from '~/services/session.server';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import type { SessionConfig } from '~/services/session.server';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const sessionConfig: SessionConfig = {
    kv: context.env.KV,
    node_env: context.env.NODE_ENV,
    secrets: context.env.AUTH_SECRET.split(','),
    tag: appConfig.cookieTag
  };
  const sessionStorage = await appSessionStorage(sessionConfig);
  const authenticator = await getAuthenticator(context, sessionStorage);
  const version = context.env.APP_VERSION;

  return json({
    version
  });
};

export default function AppLayout() {
  const { version } = useLoaderData<typeof loader>();
  const [visible, setVisible] = useState(false);
  const toggleVisible = useCallback(() => {
    setVisible((visible) => !visible);
  }, []);
  return (
    <>
      <Drawer open={visible} onClickOverlay={toggleVisible} className="bg-base-100" aria-label="Menu" side={<></>}>
        <NavBar toggleVisible={toggleVisible} version={version} />
        <Outlet />
      </Drawer>
    </>
  );
}
