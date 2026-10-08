import { describe, expect, test, vi, afterEach } from 'vitest';
import { renderHook, act, cleanup, screen, fireEvent } from '@testing-library/react';
import { ReactNode } from 'react';
import { ModalProvider, useModal } from './ModalContext';

function wrapper({ children }: { children: ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
}

describe('useModal', () => {
  afterEach(() => {
    cleanup();
  });

  test('Throws when used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useModal());
    }).toThrow('useModal must be used within a ModalProvider');

    spy.mockRestore();
  });

  test('Returns showModal and closeModal', () => {
    const { result } = renderHook(() => useModal(), { wrapper });

    expect(typeof result.current.showModal).toBe('function');
    expect(typeof result.current.closeModal).toBe('function');
  });

  test('showModal renders a modal with text and actions', () => {
    const { result } = renderHook(() => useModal(), { wrapper });

    act(() => {
      result.current.showModal({
        text: 'Are you sure?',
        actions: <button type="button">Confirm</button>,
      });
    });

    expect(screen.getByText('Are you sure?')).toBeDefined();
    expect(screen.getByText('Confirm')).toBeDefined();
  });

  test('closeModal removes a modal from the DOM', () => {
    const { result } = renderHook(() => useModal(), { wrapper });

    act(() => {
      result.current.showModal({
        text: 'Are you sure?',
        actions: (
          <button type="button" onClick={() => result.current.closeModal()}>
            Cancel
          </button>
        ),
      });
    });

    expect(screen.getByText('Are you sure?')).toBeDefined();

    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.queryByText('Are you sure?')).toBeNull();
  });
});
