import { Form, useLocation } from '@remix-run/react';
import { Avatar, Button, Divider } from 'react-daisyui';
import AppMenu from '~/components/ui/AppMenu';
import { Logo } from '~/components/ui/Logo';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { UserProfile } from '~/services/auth.server';

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
  const { pathname } = useLocation();
  const letters =
    !user || typeof user.name == 'undefined' || user.name == ''
      ? 'HU'
      : user.name.split(' ')[0].substring(0, 1) + user.name.split(' ')[1].substring(0, 1);

  return (
    <>
      <div
        className={twMerge(
          'sticky top-0 z-20 items-center gap-2 bg-base-100 bg-opacity-90 px-4 py-2 backdrop-blur',
          className,
          clsx({ hidden: !visible })
        )}
      >
        <div className="flex h-16 items-center justify-center p-8">
          <Logo hideLogoOnLargeScreen={hideLogoOnLargeScreen} showVersion={showVersion} version={version} />
        </div>
        {showUserSection && user && (
          <>
            <div className="flex w-full flex-col items-center justify-center">
              <Avatar
                innerClassName="rounded"
                size="sm"
                shape="circle"
                letters={letters}
                border={true}
                borderColor="accent"
              />
              <span className="mt-4 font-semibold">{user.name}</span>
              <span className="text-xs font-light">{user.email}</span>

              <Form method="POST" name="userMenu" action={'/auth/logout'} className="mt-4 w-full px-2">
                <Button type="submit" color="accent" size={'sm'} fullWidth={true}>
                  Logout
                </Button>
              </Form>
            </div>
            <Divider />
          </>
        )}
        <AppMenu responsive={responsive} vertical={vertical} toggleVisible={toggleVisible} />
      </div>
    </>
  );
}
