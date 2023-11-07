'use client';

import { Select } from 'react-daisyui';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { resolvedTheme, themes, setTheme } = useTheme();
  console.log(resolvedTheme);
  return (
    <>
      <Select value={resolvedTheme} onChange={(e) => setTheme(e.target.value)} aria-label="Theme toggle">
        {themes.map((val, idx) => (
          <Select.Option key={idx} value={val}>
            {val}
          </Select.Option>
        ))}
      </Select>
    </>
  );
}
