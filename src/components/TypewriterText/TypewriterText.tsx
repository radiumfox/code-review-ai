'use client';

import { useEffect, useState } from 'react';
import { TYPEWRITER_TEST_IDS } from './config';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypewriterText({ text, speed = 30, className = '', onComplete }: TypewriterTextProps) {
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;

    let index = 0;

    const timer = setInterval(() => {
      index++;
      setDisplayedCount(index);

      if (index >= text.length) {
        setIsComplete(true);
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <span className={className} data-testid={TYPEWRITER_TEST_IDS.typewriterText}>
      {text.slice(0, displayedCount)}
      {text && !isComplete && (
        <span
          className="inline-block w-0.5 h-[1em] align-middle ml-0.5 bg-[#6c6cff]"
          style={{ animation: 'blink-caret 0.75s step-end infinite' }}
          data-testid={TYPEWRITER_TEST_IDS.typewriterCaret}
        />
      )}
    </span>
  );
}
