import { Outlet } from '@remix-run/react';
import NavBar from '~/lib/components/ui/NavBar';
import { appSessionStorage } from '~/lib/services/session.server';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  let isAuthenticated: boolean = false;
  let kvSession;

  const { getSession } = await appSessionStorage({
    tag: '__olympus_net_session',
    secrets: context.env.SESSION_SECRET.split(','),
    kv: context.env.KV,
    node_env: context.env.NODE_ENV
  });
  const session = await getSession(request.headers.get('Cookie'));
  if (session.has('oauth-key')) {
    const kvId = session.get('oauth-key');
    kvSession = await context.env.KV.get(kvId, { type: 'json' });
    isAuthenticated = true;
  }

  return typedjson({ isAuthenticated, kvSession });
};
export const meta: MetaFunction = () => {
  return [{ title: 'OLYMPUS Dev' }, { name: 'description', content: 'Welcome to OLYMPUS Dev!' }];
};
export default function AppLayout() {
  const { isAuthenticated } = useTypedLoaderData<typeof loader>();
  return (
    <>
      <NavBar isAuthenticated={isAuthenticated} />
      <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
        <Outlet />
      </main>
    </>
  );
}
