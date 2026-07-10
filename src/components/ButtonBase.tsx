'use client';

import React from 'react';

export enum ButtonBaseSizes {
    Lg = 'lg',
    Md = 'md',
}

interface ButtonBaseProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  text: string;
  size?: ButtonBaseSizes;
  className?: string;
  isLoading?: boolean;
}

const sizeStyles: Record<ButtonBaseSizes, string> = {
  [ButtonBaseSizes.Lg]: 'gap-3 px-8 py-4 text-lg',
  [ButtonBaseSizes.Md]: 'gap-2 px-6 py-3 text-base',
};

function Spinner() {
  return (
    <span
      className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
    />
  );
}

export function ButtonBase({ onClick, icon, text, className, size = ButtonBaseSizes.Lg, isLoading }: ButtonBaseProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={
        `flex items-center border-2 border-[#dfdfe2]
        bg-transparent uppercase tracking-[0.15em]
        text-[#dfdfe2] transition-all duration-200
        hover:bg-[#dfdfe2] hover:text-[#0a0a23]
        focus:outline-none disabled:opacity-50 disabled:pointer-events-none
        ${sizeStyles[size]}
        ${className}`
      }
    >
      {isLoading ? <Spinner /> : icon}
      {text}
    </button>
  );
}
