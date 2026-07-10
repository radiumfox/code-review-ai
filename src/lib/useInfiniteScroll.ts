'use client';

import { useEffect, type RefObject } from 'react';

export function useInfiniteScroll(
  sentinelRef: RefObject<HTMLDivElement | null>,
  onScrollEnd: (() => void) | undefined,
  enabled: boolean,
  rootMargin: string = '100px'
) {
  useEffect(() => {
    if (!onScrollEnd || !enabled) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onScrollEnd();
        }
      },
      { rootMargin }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [onScrollEnd, enabled, rootMargin, sentinelRef]);
}
