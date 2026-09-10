'use client';

import { type ReactNode } from 'react';

type ButtonIconSize = 'sm' | 'md';

interface ButtonIconProps {
    icon: ReactNode;
    onClick: () => void;
    ariaLabel: string;
    className?: string;
    size?: ButtonIconSize;
}

const BUTTON_ICON_SIZE_CLASSES: Record<ButtonIconSize, string> = {
  sm: 'w-[30px] h-[30px]',
  md: 'w-[42px] h-[42px]',
};

export function ButtonIcon({ icon, onClick, ariaLabel, className, size = 'sm' }: ButtonIconProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded border border-[#2a2a5a] text-[#6c6cff] hover:bg-[#1a1a3e] transition-colors cursor-pointer ${BUTTON_ICON_SIZE_CLASSES[size]} ${className}`}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
}