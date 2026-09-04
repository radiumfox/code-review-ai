'use client';

import { useCallback, useEffect, useRef } from 'react';
import { NotificationType } from './types';
import { NOTIFICATION_TEST_IDS } from '@/lib/notifications/config';

interface NotificationBaseProps {
  type: NotificationType;
  message: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

const typeStyles: Record<NotificationType, string> = {
  [NotificationType.Error]: 'border-l-4 border-[#ff5555]',
  [NotificationType.Warning]: 'border-l-4 border-[#ffb86c]',
  [NotificationType.Neutral]: 'border-l-4 border-[#6c6cff]',
};

const typeBackgrounds: Record<NotificationType, string> = {
  [NotificationType.Error]: '#ff5555',
  [NotificationType.Warning]: '#ffb86c',
  [NotificationType.Neutral]: '#6c6cff',
};

function CloseIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export function NotificationBase({
  type,
  message,
  duration = 5000,
  onClose,
  className = '',
}: NotificationBaseProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (duration <= 0) return;

    timerRef.current = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [duration, handleClose]);

  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-[#dfdfe2] text-body ${typeStyles[type]} ${className}`}
      style={{ backgroundColor: `${typeBackgrounds[type]}15` }}
    >
      <span>{message}</span>
      <button
        onClick={handleClose}
        className="shrink-0 p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Close notification"
        data-testid={NOTIFICATION_TEST_IDS.buttonClose}
      >
        <CloseIcon />
      </button>
    </div>
  );
}
