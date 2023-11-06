'use client';

import { Select } from 'react-daisyui';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, themes, setTheme } = useTheme();

  return (
    <>
      <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
        {themes.map((val, idx) => (
          <Select.Option key={idx} value={val}>
            {val}
          </Select.Option>
        ))}
      </Select>
    </>
  );
}
