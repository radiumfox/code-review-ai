import { describe, expect, test, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { SlideOutDrawer } from './SlideOutDrawer';
import { TEST_IDS } from './config';

describe('SlideOutDrawer', () => {
  afterEach(() => {
    cleanup();
  });

  test('Renders children when open', () => {
    render(
      <SlideOutDrawer isOpen={true} onClose={vi.fn()}>
        <div>Drawer content</div>
      </SlideOutDrawer>
    );
    expect(screen.getByText('Drawer content')).toBeDefined();
  });

  test('Calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <SlideOutDrawer isOpen={true} onClose={onClose}>
        <div>content</div>
      </SlideOutDrawer>
    );

    const backdrop = container.querySelector(`[data-testid="${TEST_IDS.drawerBackdrop}"]`)!;
    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('Calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <SlideOutDrawer isOpen={true} onClose={onClose} buttonCloseAreaLabel="Close">
        <div>content</div>
      </SlideOutDrawer>
    );

    const button = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(button);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('Renders title when provided', () => {
    render(
      <SlideOutDrawer isOpen={true} onClose={vi.fn()} title="My Drawer">
        <div>content</div>
      </SlideOutDrawer>
    );
    expect(screen.getByText('My Drawer')).toBeDefined();
  });

  test('Applies backdropClassName to backdrop', () => {
    const { container } = render(
      <SlideOutDrawer isOpen={true} onClose={vi.fn()} backdropClassName="custom-backdrop">
        <div>content</div>
      </SlideOutDrawer>
    );
    const backdrop = container.querySelector(`[data-testid="${TEST_IDS.drawerBackdrop}"]`)!;
    expect(backdrop.className).toContain('custom-backdrop');
  });

  test('Applies panelClassName to panel', () => {
    const { container } = render(
      <SlideOutDrawer isOpen={true} onClose={vi.fn()} panelClassName="custom-panel">
        <div>content</div>
      </SlideOutDrawer>
    );

    const panel = container.querySelector(`[data-testid="${TEST_IDS.drawerPanel}"]`)!;
    expect(panel.className).toContain('custom-panel');
  });
});
