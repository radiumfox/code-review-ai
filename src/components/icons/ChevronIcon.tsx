import React from 'react';

export default function ChevronIcon({ className }: { className: string }) {
  return (
    <svg
      className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6c6cff] transition-transform ${className}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}