import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { NotificationBase } from './NotificationBase';
import { NotificationType } from './types';
import { TEST_IDS } from '@/lib/notifications/config';

describe('NotificationBase', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  test('Renders message', () => {
    render(<NotificationBase type={NotificationType.Error} message="Something failed" />);
    expect(screen.getByText('Something failed')).toBeDefined();
  });

  test('Calls onClose after duration', () => {
    const onClose = vi.fn();
    render(<NotificationBase type={NotificationType.Warning} message="Heads up" duration={3000} onClose={onClose} />);

    act(() => { vi.advanceTimersByTime(3000); });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('Does not call onClose before duration expires', () => {
    const onClose = vi.fn();
    render(<NotificationBase type={NotificationType.Error} message="fail" duration={5000} onClose={onClose} />);

    act(() => { vi.advanceTimersByTime(4999); });

    expect(onClose).not.toHaveBeenCalled();
  });

  test('Calls onClose immediately when close button is clicked', () => {
    const onClose = vi.fn();
    render(<NotificationBase type={NotificationType.Neutral} message="info" onClose={onClose} />);

    const button = screen.getAllByTestId(TEST_IDS.buttonClose)[0];
    fireEvent.click(button);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('Clears timer when close button is clicked before duration', () => {
    const onClose = vi.fn();
    render(<NotificationBase type={NotificationType.Error} message="fail" duration={5000} onClose={onClose} />);

    const button = screen.getAllByTestId(TEST_IDS.buttonClose)[0];
    fireEvent.click(button);
    act(() => { vi.advanceTimersByTime(5000); });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('Does not set timer when duration is 0', () => {
    const onClose = vi.fn();
    render(<NotificationBase type={NotificationType.Error} message="fail" duration={0} onClose={onClose} />);

    act(() => { vi.advanceTimersByTime(10000); });

    expect(onClose).not.toHaveBeenCalled();
  });

  test('Cleans up timer on unmount', () => {
    const onClose = vi.fn();
    const { unmount } = render(<NotificationBase type={NotificationType.Error} message="fail" duration={5000} onClose={onClose} />);

    unmount();
    act(() => { vi.advanceTimersByTime(5000); });

    expect(onClose).not.toHaveBeenCalled();
  });
});
