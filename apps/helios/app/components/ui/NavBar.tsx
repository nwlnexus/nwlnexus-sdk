import { Await } from '@remix-run/react';
import { Suspense } from 'react';
import { Button, Join, Loading, Navbar, Tooltip } from 'react-daisyui';
import Search from '~/components/Search';
import { Logo } from '~/components/ui/Logo';
import ThemeToggle from '~/components/ui/ThemeToggle';
import UserMenu from '~/components/ui/UserMenu';
import { appConfig } from '~/config/app.config';
import useScroll from '~/hooks/useScroll';
import Weather from 'app/components/WeatherData';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import type { UserProfile } from '~/services/auth.server';
import type { WeatherData } from 'app/components/WeatherData';

type NavBarProps = {
  apiKey: string;
  hideLogoOnLargeScreen?: boolean;
  showSearch?: boolean;
  showVersion?: boolean;
  toggleVisible: () => void;
  user: UserProfile | null;
  version: string;
  weatherData: Promise<WeatherData>;
};

export default function NavBar({
  toggleVisible,
  apiKey,
  version,
  weatherData,
  user = null,
  showVersion = true,
  showSearch = true,
  hideLogoOnLargeScreen = false
}: NavBarProps) {
  const scrolled = useScroll(50);
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <>
      <Navbar
        className={clsx(
          'sticky top-0 z-30 h-16 justify-center bg-base-100 bg-opacity-90 text-base-content backdrop-blur transition-all duration-100 [transform:translate3d(0,0,0)]',
          { 'shadow-sm': scrolled }
        )}
      >
        {user && (
          <div className="flex-none">
            <Tooltip message="Menu" position="bottom">
              <Button shape="square" color="ghost" onClick={toggleVisible} className="drawer-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-6 w-6 stroke-current"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </Button>
            </Tooltip>
          </div>
        )}
        <div className="flex flex-1 md:gap-1 lg:gap-2">
          <Logo hideLogoOnLargeScreen={hideLogoOnLargeScreen} showVersion={showVersion} version={version} />
          {showSearch && <Search />}
        </div>
        {user && (
          <Suspense fallback={<Loading variant="bars" size="md" />}>
            <Await resolve={weatherData}>
              {(data) => (
                <Weather data={data} apiKey={apiKey} size={'sm'} className="mr-2 hidden md:flex" aria-label="Weather" />
              )}
            </Await>
          </Suspense>
        )}
        <Join className="flex-none items-center justify-center gap-x-2">
          <ThemeToggle resolvedTheme={resolvedTheme!} setTheme={setTheme} themes={appConfig.appThemes} />
          {user !== null ? (
            <UserMenu user={user} />
          ) : (
            <Button
              className="ml-4"
              size="md"
              color="accent"
              variant="outline"
              aria-label="sign in"
              tag="a"
              href="/auth/login"
            >
              Sign In
            </Button>
          )}
        </Join>
      </Navbar>
    </>
  );
}
