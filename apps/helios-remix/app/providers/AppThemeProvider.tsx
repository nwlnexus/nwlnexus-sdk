import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import tailwindConfig from '../../tailwind.config';

export function AppThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      enableColorScheme={true}
      defaultTheme={'dark'}
      themes={tailwindConfig.daisyui.themes}
      disableTransitionOnChange={true}
      storageKey={'olympus-theme'}
    >
      {children}
    </ThemeProvider>
  );
}
