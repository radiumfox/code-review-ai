'use client';

import { type ReactNode } from 'react';

interface ModalBaseProps {
  show: boolean;
  text: string;
  children: ReactNode;
  onClose?: () => void;
}

export function ModalBase({ show, text, children, onClose }: ModalBaseProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div onClick={onClose} className="absolute inset-0 bg-black/50" />
      <div className="relative flex w-full max-w-96 mx-4 flex-col gap-4 rounded-xl border border-[#1e1e4a] bg-[#0d0d2b] p-5 shadow-2xl shadow-black/50">
        <p className="text-body text-gray-300">{text}</p>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {children}
        </div>
      </div>
    </div>
  );
}
