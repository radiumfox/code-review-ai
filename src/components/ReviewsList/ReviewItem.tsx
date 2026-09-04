'use client';

import { formatDate, formatTime } from '@/components/ReviewsList/helpers';
import { Review } from '@/lib/types';

interface ReviewItemProps {
  review: Review;
  isActive?: boolean;
  onClick?: () => void;
  languageTitle: string;
}

export function ReviewItem({ review, isActive, onClick, languageTitle }: ReviewItemProps) {
  return (
    <div onClick={onClick} className={`flex flex-col gap-1.5 px-3 py-3 border-b border-[#1e1e4a] last:border-b-0 transition-colors duration-200 ${isActive ? 'bg-[#6c6cff]/20 border-l-2 border-l-[#6c6cff]' : 'hover:bg-[#151540]/50 cursor-pointer'}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {formatDate(review.createdAt)} &middot; {formatTime(review.createdAt)}
        </span>
        <span className="text-xs px-1.5 py-0.5 rounded bg-[#6c6cff]/15 text-[#6c6cff] font-medium uppercase tracking-wider">
          {languageTitle}
        </span>
      </div>
      <p className="text-body text-gray-400 leading-relaxed line-clamp-2">
        {review.summary}
      </p>
    </div>
  );
}
