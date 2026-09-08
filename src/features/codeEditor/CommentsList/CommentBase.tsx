'use client';

import type { CommentBaseProps } from './types';
import { CategoryIcon } from '@/components/icons/CategoryIcon';

export function CommentBase({ line, issue, suggestedFix, category }: CommentBaseProps) {
  return (
    <li className="flex flex-col gap-1.5 py-3 border-b border-[#1e1e4a] last:border-b-0">
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