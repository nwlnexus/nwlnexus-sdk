import { Button, Join, Navbar, Tooltip } from 'react-daisyui';
import ThemeToggle from '@/components/ui/ThemeToggle';
import useScroll from '@/hooks/use-scroll';
import clsx from 'clsx';
import { useTheme } from 'next-themes';

type NavBarProps = {
  toggleVisible: () => void;
};

export default function NavBar({ toggleVisible }: NavBarProps) {
  const scrolled = useScroll(50);
  const { resolvedTheme, themes, setTheme } = useTheme();
  return (
    <>
      <Navbar
        className={clsx(
          'sticky top-0 z-30 h-16 justify-center bg-base-100 bg-opacity-90 text-base-content backdrop-blur transition-all duration-100 [transform:translate3d(0,0,0)]',
          { 'shadow-sm': scrolled }
        )}
        dataTheme={resolvedTheme}
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
            <div className="font-mono text-xs">{process.env.NEXT_PUBLIC_APP_VERSION}</div>
          </div>
        </div>
        <Join className="flex-none gap-x-2">
          <ThemeToggle resolvedTheme={resolvedTheme} setTheme={setTheme} themes={themes} />
          <Button size="md" color="accent" variant="outline" aria-label="sign in">
            Sign In
          </Button>
        </Join>
      </Navbar>
    </>
  );
}
