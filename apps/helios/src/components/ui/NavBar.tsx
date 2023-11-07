import { Button, Join, Navbar } from 'react-daisyui';
import ThemeToggle from '@/components/ui/ThemeToggle';
import useScroll from '@/hooks/use-scroll';
import Link from 'next/link';

type NavBarProps = {
  toggleVisible: () => void;
};

export default function NavBar({ toggleVisible }: NavBarProps) {
  const scrolled = useScroll(50);
  return (
    <>
      <Navbar
        className={`fixed top-0 z-30 flex w-full justify-center transition-all ${
          scrolled ? 'border-b border-gray-200 bg-white/50 backdrop-blur-xl' : 'bg-white/0'
        }`}
      >
        <div className="flex-none lg:hidden">
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
        </div>
        <div className="flex-1">
          <svg height="30" width="100" xmlnsXlink="http://www.w3.org/1999/xlink">
            <Link href="/" className="font-display flex items-center text-2xl">
              <text x="0" y="30" className="dark:text-purple-400">
                HELIOS
              </text>
            </Link>
          </svg>
        </div>
        <Join className="flex-none gap-2">
          <ThemeToggle />
          <Button size="md" color="accent" variant="outline" aria-label="sign in">
            Sign In
          </Button>
        </Join>
      </Navbar>
    </>
  );
}
