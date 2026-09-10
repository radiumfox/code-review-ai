import { type ReactNode } from 'react';

interface TooltipBaseProps {
  text: string;
  position: 'top' | 'bottom';
  hasArrow: boolean;
  isOpen: boolean;
  children: ReactNode;
}

const TOOLTIP_POSITION_CLASSES: Record<TooltipBaseProps['position'], string> = {
  top: 'bottom-full mb-2',
  bottom: 'top-full mt-2',
};

const TOOLTIP_ARROW_CLASSES: Record<TooltipBaseProps['position'], string> = {
  top: 'before:content-[\'\'] before:absolute before:left-1/2 before:-translate-x-1/2 before:-bottom-1.5 before:w-2 before:h-2 before:rotate-45 before:bg-[#2a2a5a] after:content-[\'\'] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-[5px] after:w-2 after:h-2 after:rotate-45 after:bg-[#1a1a3e]',
  bottom: 'before:content-[\'\'] before:absolute before:left-1/2 before:-translate-x-1/2 before:-top-1.5 before:w-2 before:h-2 before:rotate-45 before:bg-[#2a2a5a] after:content-[\'\'] after:absolute after:left-1/2 after:-translate-x-1/2 after:-top-[5px] after:w-2 after:h-2 after:rotate-45 after:bg-[#1a1a3e]',
};

export function TooltipBase({ text, position, hasArrow, isOpen, children }: TooltipBaseProps) {
  return (
    <div className="relative inline-flex">
      {children}
      {isOpen && (
        <div
          role="tooltip"
          className={`absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none whitespace-nowrap px-2 py-1 rounded border border-[#2a2a5a] bg-[#1a1a3e] text-xs text-gray-300 ${TOOLTIP_POSITION_CLASSES[position]} ${hasArrow ? TOOLTIP_ARROW_CLASSES[position] : ''}`}
        >
          {text}
        </div>
      )}
    </div>
  );
}