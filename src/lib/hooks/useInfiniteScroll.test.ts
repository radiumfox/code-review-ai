import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import { RefObject } from 'react';

type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  callback: ObserverCallback;
  options: IntersectionObserverInit | undefined;
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;

  constructor(cb: ObserverCallback, options?: IntersectionObserverInit) {
    this.callback = cb;
    this.options = options;
    this.observe = vi.fn();
    this.disconnect = vi.fn();
    this.unobserve = vi.fn();
    MockIntersectionObserver.instances.push(this);
  }

  static lastInstance(): MockIntersectionObserver {
    return MockIntersectionObserver.instances.at(-1)!;
  }
}

function createSentinel(): RefObject<HTMLDivElement | null> {
  return { current: document.createElement('div') };
}

function createNullSentinel(): RefObject<HTMLDivElement | null> {
  return { current: null };
}

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Does nothing when onScrollEnd is undefined', () => {
    const sentinel = createSentinel();

    renderHook(() => useInfiniteScroll(sentinel, undefined, true));

    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });

  test('Does nothing when enabled is false', () => {
    const sentinel = createSentinel();
    const onScrollEnd = vi.fn();

    renderHook(() => useInfiniteScroll(sentinel, onScrollEnd, false));

    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });

  test('Does nothing when sentinelRef.current is null', () => {
    const sentinel = createNullSentinel();
    const onScrollEnd = vi.fn();

    renderHook(() => useInfiniteScroll(sentinel, onScrollEnd, true));

    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });

  test('Creates observer and calls onScrollEnd on intersection', () => {
    const sentinel = createSentinel();
    const onScrollEnd = vi.fn();

    renderHook(() => useInfiniteScroll(sentinel, onScrollEnd, true));

    const observer = MockIntersectionObserver.lastInstance();
    expect(observer.observe).toHaveBeenCalledWith(sentinel.current);

    observer.callback([{ isIntersecting: true } as IntersectionObserverEntry]);

    expect(onScrollEnd).toHaveBeenCalledTimes(1);
  });

  test('Does not call onScrollEnd when not intersecting', () => {
    const sentinel = createSentinel();
    const onScrollEnd = vi.fn();

    renderHook(() => useInfiniteScroll(sentinel, onScrollEnd, true));

    const observer = MockIntersectionObserver.lastInstance();
    observer.callback([{ isIntersecting: false } as IntersectionObserverEntry]);

    expect(onScrollEnd).not.toHaveBeenCalled();
  });

  test('Disconnects observer on unmount', () => {
    const sentinel = createSentinel();
    const onScrollEnd = vi.fn();

    const { unmount } = renderHook(() => useInfiniteScroll(sentinel, onScrollEnd, true));

    const observer = MockIntersectionObserver.lastInstance();
    expect(observer.disconnect).not.toHaveBeenCalled();

    unmount();

    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });

  test('Re-creates observer when enabled toggles', () => {
    const sentinel = createSentinel();
    const onScrollEnd = vi.fn();

    const { rerender } = renderHook(
      ({ enabled }) => useInfiniteScroll(sentinel, onScrollEnd, enabled),
      { initialProps: { enabled: true } }
    );

    expect(MockIntersectionObserver.instances).toHaveLength(1);

    rerender({ enabled: false });

    const firstObserver = MockIntersectionObserver.instances[0];
    expect(firstObserver.disconnect).toHaveBeenCalledTimes(1);

    rerender({ enabled: true });

    expect(MockIntersectionObserver.instances).toHaveLength(2);
  });

  test('Passes rootMargin to the observer', () => {
    const sentinel = createSentinel();
    const onScrollEnd = vi.fn();

    renderHook(() => useInfiniteScroll(sentinel, onScrollEnd, true, '200px'));

    const observer = MockIntersectionObserver.lastInstance();
    expect(observer.options).toEqual({ rootMargin: '200px' });
  });
});
