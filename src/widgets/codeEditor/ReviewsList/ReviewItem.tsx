'use client';

import { type ReactNode } from 'react';
import { formatDate, formatTime } from './helpers';
import { Review } from '@/lib/types';

interface ReviewItemProps {
  review: Review;
  isActive?: boolean;
  onClick?: () => void;
  languageTitle: string;
  children?: ReactNode;
}

export function ReviewItem({ review, isActive, onClick, languageTitle, children }: ReviewItemProps) {
  return (
    <div onClick={onClick} className={`flex flex-col gap-1.5 px-3 py-3 border-b border-[#1e1e4a] last:border-b-0 transition-colors duration-200 ${isActive ? 'bg-accent/20 border-l-2 border-l-accent' : 'hover:bg-[#151540]/50 cursor-pointer'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <span className="text-xs px-1.5 py-0.5 rounded bg-accent/15 text-accent font-medium uppercase tracking-wider">
            {languageTitle}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(review.createdAt)} &middot; {formatTime(review.createdAt)}
          </span>

        </div>

        <div onClick={(event) => event.stopPropagation()}>
          {children}
        </div>
      </div>
      <p className="text-body text-gray-400 leading-relaxed line-clamp-2">
        {review.summary}
      </p>
    </div>
  );
}
