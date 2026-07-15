'use client';

import { SessionProvider } from 'next-auth/react';
import { type ReactNode } from 'react';
import { NotificationProvider } from '@/lib/notifications';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </SessionProvider>
  );
}