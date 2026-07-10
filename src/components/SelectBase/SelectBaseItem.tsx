'use client';
import React from 'react';
import { SelectBaseItemProps } from '@/components/SelectBase/types';


export function SelectBaseItem({ onClick, text, isCurrent }: SelectBaseItemProps) {
  return (
    <button
      onClick={onClick}
      className={
        `w-full text-left px-3 py-2 text-sm transition-colors
                ${isCurrent ? 'bg-[#6c6cff]/20 text-[#6c6cff]' : 'text-[#dfdfe2] hover:bg-[#1a1a3e]'}
            `}
    >
      {text}
    </button>
  );
}