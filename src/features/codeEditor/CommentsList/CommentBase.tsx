'use client';

import type { CommentBaseProps } from './types';
import { CategoryIcon } from '@/components/icons/CategoryIcon';

export function CommentBase({ line, issue, suggestedFix, category, onClick }: CommentBaseProps) {
  return (
    <li
      onClick={() => onClick?.(line)}
      className="flex flex-col gap-1.5 py-3 px-2 -mx-2 rounded last:border-b-0 cursor-pointer transition-colors hover:bg-[#2a2a6a]/30"
    >
      <div className="flex items-start gap-2">
        <p className="text-body text-gray-400 leading-relaxed space-x-2">
          <CategoryIcon category={category} className="w-4 h-4 mt-0.5 text-gray-500 shrink-0 inline" />
          <span>Line {line} · {issue}</span>
        </p>
      </div>
      <span className="text-body text-[#6c6cff] leading-relaxed">
        {suggestedFix}
      </span>
    </li>
  );
}