import { Await } from '@remix-run/react';
import { Suspense, useCallback, useState } from 'react';
import { Button, Input, Join, Loading, Menu, Navbar, Tooltip } from 'react-daisyui';
import ThemeToggle from '~/components/ui/ThemeToggle';
import { appConfig } from '~/config/app.config';
import useScroll from '~/hooks/useScroll';
import Weather from 'app/components/WeatherData';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import type { WeatherData } from 'app/components/WeatherData';

type NavBarProps = {
  toggleVisible: () => void;
  apiKey: string;
  version: string;
  weatherData: Promise<WeatherData>;
};

export default function NavBar({ toggleVisible, apiKey, version, weatherData }: NavBarProps) {
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
        <div className="flex-none lg:hidden">
          <Tooltip message="Menu" position="bottom">
            <Button shape="square" color="ghost" onClick={toggleVisible}>
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
        <div className="flex flex-1 md:gap-1 lg:gap-2">
          <div className="flex items-center gap-2">
            <Button tag="a" color="ghost" aria-label="Homepage" href="/" className="flex-0 gap-1 px-2 md:gap-2">
              <div className="font-title inline-flex text-lg md:text-2xl">
                <span className="lowercase">helios</span>
                <span className="uppercase text-accent">UI</span>
              </div>
            </Button>
            <div className="font-mono text-xs">{version}</div>
          </div>
          <div className="hidden w-full max-w-sm lg:flex">
            <Input
              className="searchbox relative mx-3 w-full"
              placeholder="Search..."
              size="md"
              color="neutral"
              bordered={false}
            />
          </div>
        </div>
        <Suspense fallback={<Loading variant="bars" size="md" />}>
          <Await resolve={weatherData}>
            {(data) => (
              <Weather data={data} apiKey={apiKey} size={'sm'} className="mr-2 hidden md:flex" aria-label="Weather" />
            )}
          </Await>
        </Suspense>
        <DesktopMenu c="hidden lg:flex mr-2"></DesktopMenu>
        <Join className="flex-none gap-x-2">
          <ThemeToggle resolvedTheme={resolvedTheme!} setTheme={setTheme} themes={appConfig.appThemes} />
          <Button size="md" color="accent" variant="outline" aria-label="sign in" tag="a" href="/auth/login">
            Sign In
          </Button>
        </Join>
      </Navbar>
    </>
  );
}

type DesktopMenuProps = {
  c?: string;
};

function DesktopMenu({ c }: DesktopMenuProps) {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setOpen((val) => !val);
  }, [setOpen]);
  return (
    <div className={typeof c == 'undefined' ? undefined : c}>
      <Menu className="rounded-box bg-base-200 lg:min-w-max " responsive={true}>
        <Menu.Item>
          <Menu.Dropdown label="Menu" onClick={() => toggleOpen} open={open}></Menu.Dropdown>
        </Menu.Item>
      </Menu>
    </div>
  );
}
