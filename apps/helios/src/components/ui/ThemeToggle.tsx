import { Dropdown } from 'react-daisyui';

type ThemeToggleProps = {
  resolvedTheme: string | undefined;
  themes: Array<string>;
  setTheme: (theme: string) => void;
};
export default function ThemeToggle({ resolvedTheme, themes, setTheme }: ThemeToggleProps) {
  return (
    <>
      <Dropdown dataTheme={resolvedTheme} end={true} title="Change Theme">
        <Dropdown.Toggle button={false} className="btn btn-ghost normal-case">
          <svg
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-5 w-5 stroke-current md:hidden"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            ></path>
          </svg>
          <span className="hidden font-normal md:inline">Theme</span>
          <svg
            width="12px"
            height="12px"
            className="hidden h-2 w-2 fill-current opacity-60 sm:inline-block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048"
          >
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
          </svg>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {themes.map((val, idx) => (
            <Dropdown.Item key={idx} onClick={() => setTheme(val)}>
              {val}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
