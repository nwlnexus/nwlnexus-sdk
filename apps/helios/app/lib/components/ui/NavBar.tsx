import { Form, Link } from '@remix-run/react';
import useScroll from '~/lib/hooks/use-scroll';
import { useTheme } from 'next-themes';

export default function NavBar() {
  const scrolled = useScroll(50);
  const { theme } = useTheme();
  return (
    <>
      <div
        className={`fixed top-0 z-30 flex w-full justify-center transition-all ${
          scrolled ? 'border-b border-gray-200 bg-white/50 backdrop-blur-xl' : 'bg-white/0'
        }`}
      >
        <div className="mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between">
          <svg height="30" width="100" xmlnsXlink="http://www.w3.org/1999/xlink">
            <Link to="/" className="font-display flex items-center text-2xl">
              <text x="0" y="30" fill="purple">
                HELIOS
              </text>
            </Link>
          </svg>
          <div>
            <Form action={'/auth/auth0'} method={'post'}>
              <button
                type="submit"
                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black dark:text-purple-400"
              >
                Sign In
              </button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
