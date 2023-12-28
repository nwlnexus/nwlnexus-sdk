import { NavLink } from '@remix-run/react';
import clsx from 'clsx';

type LogoProps = {
  hideLogoOnLargeScreen?: boolean;
  showVersion?: boolean;
  version: string;
};
export function Logo({ hideLogoOnLargeScreen = false, showVersion = true, version }: LogoProps) {
  return (
    <>
      <div className='flex items-center gap-2'>
        <NavLink
          className={clsx('flex-0 btn btn-ghost gap-1 px-2 md:gap-2', { 'lg:hidden': !hideLogoOnLargeScreen })}
          to={'/'}
          aria-label='heliosUI'
          aria-current='page'
          end={true}
        >
          <div className='font-title inline-flex text-lg md:text-2xl'>
            <span className='lowercase'>helios</span>
            <span className='text-accent uppercase'>UI</span>
          </div>
        </NavLink>
        {showVersion && <div className='font-mono text-xs'>{version}</div>}
      </div>
    </>
  );
}
