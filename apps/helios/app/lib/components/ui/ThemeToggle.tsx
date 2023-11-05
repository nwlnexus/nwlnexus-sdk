import React, { useEffect, useState } from 'react';
import { Select } from 'react-daisyui';
import { useTheme } from 'next-themes';

export const ThemeToggle = () => {
  const { theme, themes, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true!);
  }, []);

  if (!mounted) {
    return null;
  }

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
};
