'use client';
import React from 'react';
import { SelectBaseItemProps } from '@/components/SelectBase/types';


export function SelectBaseItem({ onClick, text, description, isCurrent }: SelectBaseItemProps) {
  return (
    <button
      onClick={onClick}
      className={
        `w-full text-left px-3 py-2 text-body transition-colors
                ${isCurrent ? 'bg-[#6c6cff]/20 text-[#6c6cff]' : 'text-[#dfdfe2] hover:bg-[#1a1a3e]'}
            `}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate">{text}</span>
        {description && (
          <span className="shrink-0 text-[#5d5d70] text-xs">{description}</span>
        )}
      </div>
    </button>
  );
}