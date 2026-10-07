'use client';

import { useEffect, useRef, useState } from 'react';
import type { DropdownMenuPosition, DropdownMenuProps } from './types';

export const POSITION_CLASS_MAP: Record<DropdownMenuPosition, string> = {
  bottomRight: 'right-0 top-full mt-1',
  bottomLeft: 'left-0 top-full mt-1',
  topRight: 'right-0 bottom-full mb-1',
  topLeft: 'left-0 bottom-full mb-1',
  right: 'left-full top-0 ml-1',
  left: 'right-full top-0 mr-1',
};

export function DropdownMenu({
  trigger,
  children,
  position = 'bottomLeft',
  panelClassName,
  className
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      <div onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)}>
        {trigger({ isOpen })}
      </div>
      {isOpen && (
        <div className={`absolute ${POSITION_CLASS_MAP[position]} rounded-lg border border-[#2a2a5a] bg-[#12123a] shadow-xl shadow-black/40 ${panelClassName}`}>
          {typeof children === 'function' ? children(close) : children}
        </div>
      )}
    </div>
  );
}
