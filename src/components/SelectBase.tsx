'use client';

import React, { useState, useRef, useEffect } from 'react';
import ChevronIcon from '@/components/icons/ChevronIcon';

type SelectBaseProps<T extends string> = {
  items: readonly T[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  notFoundText?: string;
};

export default function SelectBase<T extends string>({
  items,
  value,
  onChange,
  placeholder = 'Search...',
  notFoundText = 'Not found',
}: SelectBaseProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = search
    ? items.filter((name) => name.toLowerCase().includes(search.toLowerCase()))
    : items;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (name: T) => {
    onChange(name);
    setIsOpen(false);
    setSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
    }
  };

  const displayed = isOpen ? search : value;

  return (
    <div ref={containerRef} className="relative w-full min-w-35 sm:min-w-45 md:min-w-55">
      <div className="relative">
        <input
          ref={inputRef}
          value={displayed}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={
            `w-full bg-[#1a1a3e] text-[#dfdfe2] text-sm sm:text-base rounded-lg border border-[#2a2a5a] 
             px-3 py-2 sm:px-4 sm:py-2.5 pr-10 outline-none 
             placeholder:text-[#5a5a8a] transition-colors
             focus:border-[#6c6cff] focus:ring-1 focus:ring-[#6c6cff]/40
             cursor-text`
          }
        />
        <ChevronIcon className={isOpen ? 'rotate-180' : ''} />
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
          <div className="max-h-48 sm:max-h-56 md:max-h-64 overflow-y-auto custom-scrollbar">
            {filteredItems.length === 0 ? (
              <div className="px-3 sm:px-4 py-3 text-sm text-[#5a5a8a] text-center">
                {notFoundText}
              </div>
            ) : (
              filteredItems.map((name) => (
                <button
                  key={name}
                  onClick={() => handleSelect(name)}
                  className={
                    `w-full text-left px-3 sm:px-4 py-2 text-sm sm:text-base transition-colors
                    ${name === value ? 'bg-[#6c6cff]/20 text-[#6c6cff]' : 'text-[#dfdfe2] hover:bg-[#1a1a3e]'}
                  `}
                >
                  {name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
