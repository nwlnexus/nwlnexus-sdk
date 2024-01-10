import type { UserProfile } from '@services/auth.server';

import { Form, NavLink } from '@remix-run/react';
import { Avatar, Button, Divider, Menu, Tooltip } from 'react-daisyui';
import { IconContext } from 'react-icons';
import { RiLogoutBoxLine, RiSettings4Line } from 'react-icons/ri';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import AppMenu from '@components/ui/AppMenu';
import { Logo } from '@components/ui/Logo';

type SideBarProps = {
  hideLogoOnLargeScreen?: boolean;
  responsive?: boolean;
  showUserSection?: boolean;
  showVersion?: boolean;
  toggleVisible?: () => void;
  user: UserProfile | null;
  version: string;
  vertical?: boolean;
  visible: boolean;
  className?: string;
};
export default function SideBar({
  className,
  responsive = false,
  showUserSection = true,
  vertical = true,
  toggleVisible,
  user = null,
  hideLogoOnLargeScreen = false,
  showVersion = true,
  version,
  visible = false
}: SideBarProps) {
  const letters =
    !user || typeof user.displayName == 'undefined' || user.displayName == ''
      ? 'HU'
      : user.displayName.split(' ')[0].substring(0, 1) + user.displayName.split(' ')[1].substring(0, 1);

  return (
    <>
      <div
        className={twMerge(
          'bg-base-100 sticky top-0 z-20 items-center gap-2 bg-opacity-90 px-4 pb-2 pt-0 backdrop-blur',
          className,
          clsx({ hidden: !visible })
        )}
      >
        <div className='flex h-16 items-center justify-center'>
          <Logo hideLogoOnLargeScreen={hideLogoOnLargeScreen} showVersion={showVersion} version={version} />
        </div>
        {showUserSection && user && (
          <>
            <div className='flex w-full flex-col items-center justify-center pb-0'>
              <Avatar
                innerClassName='rounded'
                size='sm'
                shape='circle'
                letters={letters}
                border={false}
                borderColor='accent'
              />
              <span className='mt-4 font-semibold'>{user.displayName}</span>
              <span className='text-xs font-light'>{user.email}</span>

              <Form method='POST' name='userMenu' action={'/auth/logout'} className='mt-4 w-full px-2'>
                <Button
                  type='submit'
                  color='secondary'
                  size={'sm'}
                  fullWidth={true}
                  startIcon={
                    <IconContext.Provider value={{ size: '1.5em' }}>
                      <RiLogoutBoxLine />
                    </IconContext.Provider>
                  }
                >
                  Logout
                </Button>
              </Form>

              <Menu className='mt-6' horizontal={true}>
                <Menu.Item>
                  <Tooltip message='User settings'>
                    <NavLink to={'/user/settings'}>
                      <IconContext.Provider value={{ size: '1.5em' }}>
                        <RiSettings4Line />
                      </IconContext.Provider>
                    </NavLink>
                  </Tooltip>
                </Menu.Item>
              </Menu>
            </div>
            <Divider />
          </>
        )}
        <AppMenu responsive={responsive} vertical={vertical} toggleVisible={toggleVisible} />
      </div>
    </>
  );
}
