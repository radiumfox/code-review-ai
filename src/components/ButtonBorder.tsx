import { useMemo, ReactNode } from 'react';
import { SpinnerBase } from '@/components/SpinnerBase';

type ButtonBorderSizes = 'sm' | 'md' | 'lg';

interface ButtonBorderProps {
    theme?: 'default' | 'success' | 'error';
    isLoading?: boolean;
    disabled?: boolean;
    text: string;
    onClick?: () => void;
    icon?: ReactNode;
    size?: ButtonBorderSizes;
}

const sizeStyles: Record<ButtonBorderSizes, string> = {
  lg: 'gap-3 px-8 py-4 text-lg',
  md: 'gap-2 px-6 py-2.5 text-sm',
  sm: 'gap-1.5 px-4 py-2 text-sm',
};

export function ButtonBorder({ theme, isLoading, disabled, text, onClick, icon, size = 'md' }: ButtonBorderProps) {
  const currentClasses = useMemo(() => {
    switch (theme) {
    case 'success':
      return 'border-[#4ade80] text-[#4ade80] bg-[#4ade80]/10';
    case 'error':
      return 'border-[#ff5555] text-[#ff5555] bg-[#ff5555]/10';
    default:
      return 'border-[#6c6cff] text-[#6c6cff] hover:bg-[#6c6cff] hover:text-[#0a0a23]';
    }
  }, [theme]);

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
          flex items-center justify-center
          uppercase tracking-widest rounded-lg border transition-all
          ${sizeStyles[size]}
          ${currentClasses}
          disabled:opacity-40 disabled:pointer-events-none cursor-pointer
          focus:outline-none
          ${isLoading || disabled ? 'cursor-default pointer-events-none' : ''}
      `}
    >
      {isLoading ? <SpinnerBase /> : icon}
      {text}
    </button>
  );
}