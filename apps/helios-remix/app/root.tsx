import process from 'node:process';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { cssBundleHref } from '@remix-run/css-bundle';
import { AppThemeProvider } from '~/providers/AppThemeProvider';
import type { LinksFunction } from '@remix-run/cloudflare';
import tailwindCSS from './styles/tailwind.css';

globalThis.process = process;
export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: tailwindCSS },
  { rel: 'canonical', href: 'https://helios.nwlnexus.xyz' }
];

export default function App() {
  return (
    <html lang="en-US" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppThemeProvider>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </AppThemeProvider>
      </body>
    </html>
  );
}