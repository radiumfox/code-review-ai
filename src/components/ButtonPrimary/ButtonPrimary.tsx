'use client';

import { type ReactNode } from 'react';
import { SpinnerBase } from '@/components/SpinnerBase';

type ButtonPrimaryMode = 'primary' | 'destructive';

interface ButtonPrimaryProps {
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
  text: string;
  mode?: ButtonPrimaryMode;
  className?: string;
}

const modeStyles: Record<ButtonPrimaryMode, string> = {
  primary: 'bg-accent hover:bg-accent-hover',
  destructive: 'bg-destructive hover:bg-destructive-hover',
};

export function ButtonPrimary({ onClick, disabled, isLoading, icon, text, mode = 'primary', className = '' }: ButtonPrimaryProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={
        `max-w-100 w-full flex items-center justify-center gap-2 rounded-lg uppercase tracking-widest text-body font-medium py-2 text-[#0a0a23] transition-colors cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-default
        ${modeStyles[mode]}
        ${className}`
      }
    >
      {isLoading ? <SpinnerBase className="border-[#0a0a23]" /> : icon}
      {text}
    </button>
  );
}
