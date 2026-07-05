'use client';

import React, { useState, useRef, useEffect } from 'react';
import ChevronIcon from '@/components/icons/ChevronIcon';

type SelectItem<T extends string> = { value: T; label: string };

type SelectBaseProps<T extends string> = {
  items: readonly SelectItem<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  notFoundText?: string;
  className?: string;
};

export default function SelectBase<T extends string>({
  items,
  value,
  onChange,
  placeholder = 'Search...',
  notFoundText = 'Not found',
  className = ''
}: SelectBaseProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = search
    ? items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
    : items;

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (item: SelectItem<T>) => {
    onChange(item.value);
    setIsOpen(false);
    setSearch('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
    }
  };

  const activeLabel = items.find((item) => item.value === value)?.label ?? value;
  const displayed = isOpen ? search : activeLabel;

  return (
    <div ref={containerRef} className={`relative w-full min-w-45 ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          value={displayed}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={
            `w-full bg-[#1a1a3e] text-[#dfdfe2] text-sm rounded-lg border border-[#2a2a5a] 
             px-3 py-2 pr-10 outline-none 
             placeholder:text-[#5a5a8a] transition-colors
             focus:border-[#6c6cff] focus:ring-1 focus:ring-[#6c6cff]/40
             cursor-text`
          }
          autoComplete="off"
        />
        <ChevronIcon className={`${isOpen ? 'rotate-180' : ''} transition-transform duration-150`} />
      </div>

      {isOpen && (
        <div
          className={
            `absolute top-full left-0 right-0 mt-1 z-50 
            bg-[#12123a] border border-[#2a2a5a]
            rounded-lg shadow-xl shadow-black/40
            overflow-hidden`
          }
        >
          <div className="max-h-56 overflow-y-auto custom-scrollbar">
            {filteredItems.length === 0 ? (
              <div className="px-3 py-3 text-sm text-[#5a5a8a] text-center">
                {notFoundText}
              </div>
            ) : (
              filteredItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleSelect(item)}
                  className={
                    `w-full text-left px-3 py-2 text-sm transition-colors
                    ${item.value === value ? 'bg-[#6c6cff]/20 text-[#6c6cff]' : 'text-[#dfdfe2] hover:bg-[#1a1a3e]'}
                  `}
                >
                  {item.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
