import { Outlet, useLoaderData } from '@remix-run/react';
import { useCallback, useState } from 'react';
import { Drawer } from 'react-daisyui';
import { json } from '@remix-run/cloudflare';
import NavBar from '~/components/ui/NavBar';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';

export const loader = async ({ context }: LoaderFunctionArgs) => {
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
