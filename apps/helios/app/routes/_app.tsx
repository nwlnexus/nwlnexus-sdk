import { Outlet } from '@remix-run/react';
import { Suspense } from 'react';
import NavBar from '~/lib/components/ui/NavBar';
import { appSessionStorage } from '~/lib/services/session.server';
import { typedjson } from 'remix-typedjson';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const { getSession } = await appSessionStorage(context);
  const session = await getSession(request.headers.get('Cookie'), {});
  if (session.has('oauth-key')) {
    console.log('Session exists');
    const kvId = session.get('oauth-key');
    const kvSession = await context.env.KV.get(kvId, { type: 'json' });
    console.log(kvSession);
  } else {
    console.log('Not logged in');
  }

  return typedjson({});
};
export const meta: MetaFunction = () => {
  return [{ title: 'OLYMPUS Dev' }, { name: 'description', content: 'Welcome to OLYMPUS Dev!' }];
};
export default function AppLayout() {
  return (
    <>
      <Suspense fallback={'...'}>
        <NavBar />
      </Suspense>
      <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
        <Outlet />
      </main>
    </>
  );
}
