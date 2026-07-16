'use client';

export interface ReviewItemData {
  id: string;
  createdAt: Date;
  language: string;
  summary: string;
}

interface ReviewItemProps {
  review: ReviewItemData;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className="flex flex-col gap-1.5 px-3 py-3 border-b border-[#1e1e4a] last:border-b-0 cursor-pointer hover:bg-[#151540]/50 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-500">
          {formatDate(review.createdAt)} &middot; {formatTime(review.createdAt)}
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#6c6cff]/15 text-[#6c6cff] font-medium uppercase tracking-wider">
          {review.language}
        </span>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
        {review.summary}
      </p>
    </div>
  );
}
