'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { NotificationBase } from './NotificationBase';
import { NotificationType } from './types';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = crypto.randomUUID();

    setNotifications((prev) => [...prev, { ...notification, id }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const value = useMemo(
    () => ({ showNotification, removeNotification }),
    [showNotification, removeNotification]
  );

  return (
    <NotificationContext value={value}>
      {children}
      <div className="fixed top-20 left-0 right-0 z-50 flex flex-col gap-2 p-4 pointer-events-none">
        {notifications.map((notification) => (
          <NotificationBase
            key={notification.id}
            type={notification.type}
            message={notification.message}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
            className="pointer-events-auto"
          />
        ))}
      </div>
    </NotificationContext>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  return context;
}
