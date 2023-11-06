'use client';

import ThemeToggle from '@/components/ui/ThemeToggle';
import useScroll from '@/hooks/use-scroll';
import Link from 'next/link';

export default function NavBar() {
  const scrolled = useScroll(50);
  return (
    <>
      <div
        className={`fixed top-0 z-30 flex w-full justify-center transition-all ${
          scrolled ? 'border-b border-gray-200 bg-white/50 backdrop-blur-xl' : 'bg-white/0'
        }`}
      >
        <div className="mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between">
          <svg height="30" width="100" xmlnsXlink="http://www.w3.org/1999/xlink">
            <Link href="/" className="font-display flex items-center text-2xl">
              <text x="0" y="30" className="dark:text-purple-400">
                HELIOS
              </text>
            </Link>
          </svg>
          <div className="inline-flex items-center justify-between gap-2">
            <ThemeToggle />
            <form action={'/auth/auth0'} method={'post'}>
              <button
                type="submit"
                className="bg-base rounded-full border border-black p-1.5 px-4 text-sm text-primary transition-all hover:bg-white hover:text-black dark:text-primary"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
