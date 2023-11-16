import { Button, Input, Join, Navbar, Tooltip, useTheme } from 'react-daisyui';
import ThemeToggle from '~/components/ui/ThemeToggle';
import { config } from '~/config/app.config';
import useScroll from '~/hooks/use-scroll';
import clsx from 'clsx';

type NavBarProps = {
  toggleVisible: () => void;
  version: string;
};

export default function NavBar({ toggleVisible, version }: NavBarProps) {
  const scrolled = useScroll(50);
  const { theme, setTheme } = useTheme('dark');

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
        <Join className="flex-none gap-x-2">
          <ThemeToggle resolvedTheme={theme} setTheme={setTheme} themes={config.appThemes} />
          <Button size="md" color="accent" variant="outline" aria-label="sign in">
            Sign In
          </Button>
        </Join>
      </Navbar>
    </>
  );
}
