'use client';

import { type ReactNode } from 'react';

interface ButtonIconProps {
    icon: ReactNode;
    onClick: () => void;
    ariaLabel: string;
    className?: string;
}

export function ButtonIcon({ icon, onClick, ariaLabel, className }: ButtonIconProps) {
  return (
    <button
      onClick={onClick}
      className={`ml-auto p-1.5 rounded border border-[#2a2a5a] text-[#6c6cff] hover:bg-[#1a1a3e] transition-colors cursor-pointer ${className}`}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
}