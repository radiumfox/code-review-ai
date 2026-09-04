'use client';

import { type ReactNode } from 'react';

type ButtonBaseSizes = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  onClick?: () => void;
  icon?: ReactNode;
  text: string;
  size?: ButtonBaseSizes;
  className?: string;
  isLoading?: boolean;
}

const sizeStyles: Record<ButtonBaseSizes, string> = {
  lg: 'gap-3 px-8 py-4 text-lg',
  md: 'gap-2 px-6 py-3 text-base',
  sm: 'gap-1.5 px-4 py-2 text-body',
};

function Spinner() {
  return (
    <span
      className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
    />
  );
}

export function ButtonBase({
  onClick,
  icon,
  text,
  className,
  size = 'lg',
  isLoading
}: ButtonBaseProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={
        `flex items-center border-2 border-[#dfdfe2] justify-center
        bg-transparent uppercase tracking-[0.15em]
        text-[#dfdfe2] transition-all duration-200
        hover:bg-[#dfdfe2] hover:text-[#0a0a23]
        focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer
        ${sizeStyles[size]}
        ${className}`
      }
    >
      {isLoading ? <Spinner /> : icon}
      {text}
    </button>
  );
}
