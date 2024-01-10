import { signal } from '@preact/signals-react';
import { createContext } from 'react';

type AppStateProps = {
  notifs:
    | {
        msg: string;
        status?: string;
      }[]
    | [];
};

const createAppState = () => {
  const notifs = signal<AppStateProps['notifs']>([]);
  return { notifs };
};

const AppState = createContext(createAppState());

export { AppState, createAppState };
