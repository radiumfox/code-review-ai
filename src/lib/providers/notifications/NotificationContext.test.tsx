import { describe, expect, test, vi, afterEach } from 'vitest';
import { renderHook, act, cleanup, screen, fireEvent } from '@testing-library/react';
import { ReactNode } from 'react';
import { NotificationProvider, useNotification } from './NotificationContext';
import { NotificationType } from './types';
import { NOTIFICATION_TEST_IDS } from './config';

function wrapper({ children }: { children: ReactNode }) {
  return <NotificationProvider>{children}</NotificationProvider>;
}

describe('useNotification', () => {
  afterEach(() => {
    cleanup();
  });

  test('Throws when used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useNotification());
    }).toThrow('useNotification must be used within a NotificationProvider');

    spy.mockRestore();
  });

  test('Returns showNotification and removeNotification', () => {
    const { result } = renderHook(() => useNotification(), { wrapper });

    expect(typeof result.current.showNotification).toBe('function');
    expect(typeof result.current.removeNotification).toBe('function');
  });

  test('showNotification adds a notification to the DOM', () => {
    const { result } = renderHook(() => useNotification(), { wrapper });

    act(() => {
      result.current.showNotification({
        type: NotificationType.Error,
        message: 'Test error',
      });
    });

    expect(screen.getByText('Test error')).toBeDefined();
  });

  test('removeNotification removes a notification from the DOM', () => {
    const { result } = renderHook(() => useNotification(), { wrapper });

    let id: string;
    act(() => {
      result.current.showNotification({
        type: NotificationType.Warning,
        message: 'Warning msg',
      });
    });

    expect(screen.getByText('Warning msg')).toBeDefined();

    const buttons = screen.getAllByTestId(NOTIFICATION_TEST_IDS.buttonClose);
    fireEvent.click(buttons[buttons.length - 1]);

    expect(screen.queryByText('Warning msg')).toBeNull();
  });
});
