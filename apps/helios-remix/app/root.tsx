import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction } from '@remix-run/cloudflare';
import tailwindCSS from './styles/tailwind.css';

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter' },
  { rel: 'stylesheet', href: tailwindCSS },
  { rel: 'canonical', href: 'https://helios.nwlnexus.xyz' }
];

export default function App() {
  // noinspection HtmlRequiredTitleElement
  return (
    <html lang="en-US" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
