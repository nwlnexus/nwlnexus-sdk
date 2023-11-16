import { config } from '~/config/app.config';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

export function AppThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      enableColorScheme={true}
      defaultTheme={'sunset'}
      themes={config.appThemes}
      disableTransitionOnChange={true}
      storageKey={'olympus-theme'}
    >
      {children}
    </ThemeProvider>
  );
}
