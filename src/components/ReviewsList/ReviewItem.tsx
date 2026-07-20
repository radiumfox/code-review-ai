'use client';

import { formatDate, formatTime } from '@/components/ReviewsList/helpers';

export interface ReviewItemData {
  id: string;
  createdAt: string;
  language: string;
  summary: string;
}

interface ReviewItemProps {
  review: ReviewItemData;
  onClick?: () => void;
}

export function ReviewItem({ review, onClick }: ReviewItemProps) {
  return (
    <div onClick={onClick} className="flex flex-col gap-1.5 px-3 py-3 border-b border-[#1e1e4a] last:border-b-0 cursor-pointer hover:bg-[#151540]/50 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {formatDate(review.createdAt)} &middot; {formatTime(review.createdAt)}
        </span>
        <span className="text-xs px-1.5 py-0.5 rounded bg-[#6c6cff]/15 text-[#6c6cff] font-medium uppercase tracking-wider">
          {review.language}
        </span>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
        {review.summary}
      </p>
    </div>
  );
}
