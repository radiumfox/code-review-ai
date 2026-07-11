import { ReactNode } from 'react';

export function ButtonIcon({ icon, onClick, ariaLabel }: { icon: ReactNode; onClick: () => void; ariaLabel: string }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden ml-auto p-1.5 rounded border border-[#2a2a5a] text-[#6c6cff] hover:bg-[#1a1a3e] transition-colors cursor-pointer"
      aria-label={ariaLabel}
    >
      { icon }
    </button>
  );
}