import { NavLink, useLocation } from '@remix-run/react';
import { Menu } from 'react-daisyui';
import { appConfig } from '~/config/app.config';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type AppMenuProps = {
  className?: string;
  horizontal?: boolean;
  innerClassName?: string;
  innerProps?: any[];
  responsive?: boolean;
  toggleVisible?: () => void;
  vertical?: boolean;
};

export default function AppMenu({
  className,
  innerClassName,
  responsive = true,
  vertical = true,
  horizontal = false,
  toggleVisible,
  ...props
}: AppMenuProps) {
  const { pathname } = useLocation();
  const nav = appConfig.navMenu;
  // const [open, setOpen] = useState(false);
  // const toggleOpen = useCallback(() => {
  //   setOpen((val) => !val);
  // }, [setOpen]);
  return (
    <div className={twMerge(className, '')}>
      <Menu
        className={twMerge('text-secondary', innerClassName)}
        responsive={responsive}
        vertical={vertical}
        horizontal={horizontal}
        {...props}
      >
        {nav.map((i, t) => (
          <Menu.Item
            key={t}
            className={clsx(i.href == pathname ? 'active' : '')}
            aria-current={i.href == pathname}
            aria-label={i.title}
            onClick={toggleVisible}
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
