import {
  isRouteErrorResponse,
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError
} from '@remix-run/react';
import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction } from '@remix-run/cloudflare';

import tailwindCSS from '@css/tailwind.css';

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  {
    media: 'screen and (min-width: 520px)',
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com'
  },
  {
    media: 'screen and (min-width: 520px)',
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: ''
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;900&family=Noto+Sans+JP:wght@300;900&family=Noto+Sans:wght@300;900&family=Vazirmatn:wght@300;900&display=swap',
    media: 'screen and (min-width: 520px)'
  },
  { rel: 'stylesheet', href: tailwindCSS },
  { rel: 'canonical', href: 'https://helios.nwlnexus.xyz' }
];

export default function Helios() {
  // noinspection HtmlRequiredTitleElement
  return (
    <html lang='en-US' suppressHydrationWarning={true}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className={'bg-background min-h-screen font-sans antialiased'}>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
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
    <html lang='en-US' suppressHydrationWarning={true} className='h-full'>
      <head>
        <title>Oh No!</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='h-full'>
        <main className='grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8'>
          <div className='text-center'>
            <p className='text-base font-bold'>{status_code}</p>
            <h1 className='mt-4 text-3xl font-semibold tracking-tight sm:text-5xl'>{status_msg}</h1>
            <p className='mt-6 text-base leading-7'>{msg}</p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <NavLink to='/' className='btn btn-accent px-3.5 py-2.5 text-sm shadow-sm'>
                Go back home
              </NavLink>
              <Link to='/support' className='btn btn-neutral text-sm'>
                Contact support <span aria-hidden='true'>&rarr;</span>
              </Link>
            </div>
          </div>
        </main>
        <Scripts />
      </body>
    </html>
  );
}
