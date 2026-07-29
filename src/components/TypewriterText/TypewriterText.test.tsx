import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { render, act, cleanup } from '@testing-library/react';
import { TypewriterText } from './TypewriterText';
import { TYPEWRITER_TEST_IDS } from './config';

describe('TypewriterText', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  test('Renders empty span initially when text is empty', () => {
    const { container } = render(<TypewriterText text="" />);
    expect(container.querySelector('span')?.textContent).toBe('');
  });

  test('Progressively reveals characters', () => {
    const { container } = render(<TypewriterText text="Hi" speed={100} />);
    const span = container.querySelector(`[data-testid="${TYPEWRITER_TEST_IDS.typewriterText}"]`)!;

    act(() => { vi.advanceTimersByTime(100); });
    expect(span.textContent).toContain('H');

    act(() => { vi.advanceTimersByTime(100); });
    expect(span.textContent).toContain('Hi');
  });

  test('Shows blinking cursor while typing', () => {
    const { container } = render(<TypewriterText text="Hello" speed={100} />);

    act(() => { vi.advanceTimersByTime(50); });

    const cursor = container.querySelector(`[data-testid="${TYPEWRITER_TEST_IDS.typewriterCaret}"]`);
    expect(cursor).toBeDefined();
  });

  test('Hides cursor after text is complete', () => {
    const { container } = render(<TypewriterText text="X" speed={100} />);

    act(() => { vi.advanceTimersByTime(100); });

    const cursor = container.querySelector(`[data-testid="${TYPEWRITER_TEST_IDS.typewriterCaret}"]`);
    expect(cursor).toBeNull();
  });

  test('Applies className prop', () => {
    const { container } = render(<TypewriterText text="A" className="custom" />);
    expect(container.querySelector('span')?.className).toContain('custom');
  });
});
