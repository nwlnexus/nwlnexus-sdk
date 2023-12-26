import { Await } from '@remix-run/react';
import { Suspense, useEffect, useState } from 'react';
import { Button, Join, Loading, Navbar, Tooltip } from 'react-daisyui';
import { IconContext } from 'react-icons';
import { RiLoginBoxLine } from 'react-icons/ri';
import Search from '@components//Search';
import { Logo } from '@components//ui/Logo';
import ThemeToggle from '@components//ui/ThemeToggle';
import UserMenu from '@components//ui/UserMenu';
import Weather from '@components//WeatherData';
import { appConfig } from '@config/app.config';
import useScroll from '@hooks/useScroll';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import type { WeatherData } from '@components//WeatherData';
import type { UserProfile } from '@services/auth.server';

type NavBarProps = {
  apiKey: string;
  hideLogoOnLargeScreen?: boolean;
  showSearch?: boolean;
  showVersion?: boolean;
  showUserMenu?: boolean;
  showToggle?: boolean;
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
  showToggle = false,
  showVersion = false,
  showSearch = false,
  showUserMenu = false,
  hideLogoOnLargeScreen = false
}: NavBarProps) {
  const scrolled = useScroll(50);
  const { resolvedTheme, setTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  return (
    <>
      <Navbar
        className={clsx(
          'sticky top-0 z-30 h-16 justify-center bg-base-100 bg-opacity-90 text-base-content backdrop-blur transition-all duration-100 [transform:translate3d(0,0,0)]',
          { 'shadow-sm': scrolled }
        )}
      >
        <Tooltip message='Menu' position='bottom' className='before:text-xs before:content-[attr(data-tip)]'>
          <Button
            tag={'label'}
            shape='square'
            color='ghost'
            onClick={toggleVisible}
            aria-label={'Open Menu'}
            htmlFor={'drawer'}
            className={`drawer-button ${showToggle ? '' : 'lg:hidden'}`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              className='inline-block h-5 w-5 stroke-current md:h-6 md:w-6'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
            </svg>
          </Button>
        </Tooltip>

        <div className='flex flex-1 md:gap-1 lg:gap-2'>
          <Logo hideLogoOnLargeScreen={hideLogoOnLargeScreen} showVersion={showVersion} version={version} />

          {showSearch && <Search />}
        </div>
        {user && (
          <Suspense fallback={<Loading variant='bars' size='md' />}>
            <Await resolve={weatherData}>
              {data => (
                <Weather data={data} apiKey={apiKey} size={'sm'} className='mr-2 hidden md:flex' aria-label='Weather' />
              )}
            </Await>
          </Suspense>
        )}
        <Join className='flex-none items-center justify-center gap-x-2'>
          <ThemeToggle resolvedTheme={resolvedTheme!} setTheme={setTheme} themes={appConfig.appThemes} />
          {isLoggedIn && showUserMenu && <UserMenu user={user!} />}
          {!isLoggedIn && (
            <Button
              className='ml-4'
              size='md'
              color='accent'
              variant='outline'
              aria-label='sign in'
              tag='a'
              href='/auth/login'
              endIcon={
                <IconContext.Provider value={{ size: '1.5em' }}>
                  <RiLoginBoxLine />
                </IconContext.Provider>
              }
            >
              Sign In
            </Button>
          )}
        </Join>
      </Navbar>
    </>
  );
}
