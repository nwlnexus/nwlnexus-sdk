'use client';

import { ReactNode, useCallback, useState } from 'react';
import { Drawer } from 'react-daisyui';
import NavBar from '@/components/ui/NavBar';

export default function AppLayout({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const toggleVisible = useCallback(() => {
    setVisible((visible) => !visible);
  }, []);
  return (
    <>
      <Drawer open={visible} onClickOverlay={toggleVisible} side={<></>}>
        <NavBar toggleVisible={toggleVisible} />
        {children}
      </Drawer>
    </>
  );
}
