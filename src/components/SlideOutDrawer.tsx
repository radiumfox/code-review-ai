import { StarIcon } from '@/components/icons/StarIcon';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import { type ReactNode } from 'react';

interface SlideOutDrawerProps {
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    buttonCloseAreaLabel?: string;
    className?: string;
}

export function SlideOutDrawer({ children, onClose, isOpen, buttonCloseAreaLabel, title, className  }: SlideOutDrawerProps) {
  return (
    <>
      <div
        className={
          `fixed inset-0 bg-black/50 z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          ${className}`
        }
        onClick={onClose}
      />
      <div
        className={
          `fixed right-0 top-0 bottom-0 w-80 z-50 flex flex-col bg-[#0d0d2b] border-l border-[#1e1e4a] shadow-2xl transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
        }
      >
        <div className="flex items-center justify-between px-4 py-3 bg-[#151540] border-b border-[#1e1e4a]">
          <div className="flex items-center gap-2">
            <StarIcon className="text-[#6c6cff] w-4 h-4" />
            <span className="uppercase text-xs font-medium text-[#6c6cff]">{ title }</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#6c6cff] hover:bg-[#1a1a3e] transition-colors cursor-pointer"
            aria-label={buttonCloseAreaLabel}
          >
            <ArrowRightIcon className="w-4 h-4 rotate-180" />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}