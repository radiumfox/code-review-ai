'use client';

import { useState, useRef, useEffect } from 'react';
import ChevronIcon from '@/components/icons/ChevronIcon';
import { useInfiniteScroll } from '@/lib/useInfiniteScroll';
import { SelectBaseItem } from './SelectBaseItem';
import type { SelectItem, SelectBaseProps } from '@/components/SelectBase/types';

export function SelectBase<T extends string>({
  items,
  value,
  onChange,
  placeholder = 'Search...',
  notFoundText = 'Not found',
  className = '',
  onScrollEnd,
  isLoading = false,
  hasMore = false
}: SelectBaseProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

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

  useInfiniteScroll(sentinelRef, onScrollEnd, hasMore && isOpen);

  const handleSelect = (item: SelectItem<T>) => {
    if(onChange) onChange(item.value);
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
          onChange={(event) => setSearch(event.target.value)}
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
            {filteredItems.length === 0 && !isLoading ? (
              <div className="px-3 py-3 text-sm text-[#5a5a8a] text-center">
                {notFoundText}
              </div>
            ) : (
              <>
                {filteredItems.map((item) => (
                  <SelectBaseItem
                    key={item.value}
                    onClick={() => handleSelect(item)}
                    isCurrent={item.value === value}
                    text={item.label}
                  />
                ))}
                {hasMore && (
                  <div ref={sentinelRef} className="flex items-center justify-center px-3 py-3">
                    <div className={`h-5 w-5 rounded-full border-2 border-[#6c6cff] border-t-transparent ${isLoading ? 'animate-spin' : ''}`} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
