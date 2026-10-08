'use client';

import { SessionProvider } from 'next-auth/react';
import { type ReactNode } from 'react';
import { NotificationProvider } from '@/lib/notifications';
import { ModalProvider } from '@/lib/providers/modal';
import { store } from '@/store';
import { Provider } from 'react-redux';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <NotificationProvider>
          <ModalProvider>{children}</ModalProvider>
        </NotificationProvider>
      </SessionProvider>
    </Provider>
  );
}