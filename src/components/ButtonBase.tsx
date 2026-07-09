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
}

const sizeStyles: Record<NonNullable<ButtonBaseSizes>, string> = {
  [ButtonBaseSizes.Lg]: 'gap-3 px-8 py-4 text-lg',
  [ButtonBaseSizes.Md]: 'gap-2 px-6 py-3 text-base',
};

export function ButtonBase({ onClick, icon, text, className, size = ButtonBaseSizes.Lg }: ButtonBaseProps) {
  return (
    <button
      onClick={onClick}
      className={
        `flex items-center border-2 border-[#dfdfe2]
        bg-transparent uppercase tracking-[0.15em]
        text-[#dfdfe2] transition-all duration-200
        hover:bg-[#dfdfe2] hover:text-[#0a0a23]
        focus:outline-none ${sizeStyles[size]}
        ${className}`
      }
    >
      {icon}
      {text}
    </button>
  );
}
