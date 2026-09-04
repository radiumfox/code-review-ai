'use client';

import { PlusIcon } from '@/components/icons/PlusIcon';

interface CreateReviewItemButtonProps {
  isActive?: boolean;
  onClick?: () => void;
}

export function CreateReviewButton({ isActive, onClick }: CreateReviewItemButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center min-h-11.25 gap-3 px-3 py-3 border-b border-[#1e1e4a] last:border-b-0 transition-colors duration-200 ${
        isActive
          ? 'bg-[#6c6cff]/20 border-l-2 border-l-[#6c6cff] cursor-default'
          : 'hover:bg-[#151540]/50 cursor-pointer'
      }`}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#6c6cff]/15">
        <PlusIcon className="w-4 h-4 text-[#6c6cff]" />
      </div>
      <span className="text-body text-gray-400 ">New review</span>
    </button>
  );
}