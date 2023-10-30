import { Outlet } from '@remix-run/react';
import { Suspense } from 'react';
import NavBar from '~/lib/components/ui/NavBar';

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
