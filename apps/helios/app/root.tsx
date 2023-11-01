import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { cssBundleHref } from '@remix-run/css-bundle';
import { Theme } from '@radix-ui/themes';
import { ThemeProvider } from 'next-themes';
import type { LinksFunction } from '@remix-run/cloudflare';
import type { PropsWithChildren } from 'react';
import tailwindCSS from './css/app.css';
import radixUITheme from '@radix-ui/themes/styles.css';

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: radixUITheme },
  { rel: 'stylesheet', href: tailwindCSS },
  { rel: 'canonical', href: 'https://helios.nwlnexus.net' }
];

function Document({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute={'class'}
      enableSystem={true}
      enableColorScheme={true}
      defaultTheme={'dark'}
      disableTransitionOnChange
    >
      <Theme>
        <Outlet />
        {children}
      </Theme>
    </ThemeProvider>
  );
}

export default function App() {
  // noinspection HtmlRequiredTitleElement
  return (
    <html lang="en-US" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
        <Meta />
        <Links />
      </head>
      <body>
        <Document>
          <ScrollRestoration />
          <Scripts />
          {/*<ThemePanel />*/}
          <LiveReload />
        </Document>
      </body>
    </html>
  );
}
