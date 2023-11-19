import { NavLink, useLocation } from '@remix-run/react';
import { Menu } from 'react-daisyui';
import { appConfig } from '~/config/app.config';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type AppMenuProps = {
  innerClassName?: string;
  innerProps?: any[];
  className?: string;
  responsive?: boolean;
};

export default function AppMenu({ className, innerClassName, responsive = true, ...props }: AppMenuProps) {
  const { pathname } = useLocation();
  const nav = appConfig.navMenu;
  // const [open, setOpen] = useState(false);
  // const toggleOpen = useCallback(() => {
  //   setOpen((val) => !val);
  // }, [setOpen]);
  return (
    <div className={twMerge(className, '')}>
      <Menu className={twMerge('text-secondary lg:min-w-max', innerClassName)} responsive={responsive} {...props}>
        {nav.map((i, t) => (
          <Menu.Item
            key={t}
            className={clsx(i.href == pathname ? 'active' : '')}
            aria-current={i.href == pathname}
            aria-label={i.title}
          >
            <NavLink to={i.href} className={clsx(i.href == pathname ? '!text-primary' : '')}>
              {i.title}
            </NavLink>
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
}
