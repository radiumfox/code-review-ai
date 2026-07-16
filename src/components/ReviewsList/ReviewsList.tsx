'use client';

import { ReviewItem, ReviewItemData } from './ReviewItem';

const MOCK_REVIEWS: ReviewItemData[] = [
  {
    id: '1',
    createdAt: new Date('2026-07-16T14:32:00'),
    language: 'TypeScript',
    summary: 'The function handles user authentication correctly but lacks proper error handling for network failures and timeout scenarios. Consider adding retry logic.',
  },
  {
    id: '2',
    createdAt: new Date('2026-07-16T11:05:00'),
    language: 'Python',
    summary: 'Memory usage could be improved by using a generator instead of building the full list in memory. The current approach loads all data at once.',
  },
  {
    id: '3',
    createdAt: new Date('2026-07-15T18:47:00'),
    language: 'Rust',
    summary: 'Potential integer overflow in the counter calculation. Use checked_add or saturating_add to prevent unexpected behavior in production.',
  },
  {
    id: '4',
    createdAt: new Date('2026-07-14T09:12:00'),
    language: 'JavaScript',
    summary: 'The event listener is never cleaned up, which will cause a memory leak when the component unmounts. Add a cleanup function in useEffect.',
  },
  {
    id: '5',
    createdAt: new Date('2026-07-13T16:30:00'),
    language: 'Go',
    summary: 'The goroutine has no synchronization mechanism. Use a WaitGroup or channel to ensure all goroutines complete before the function returns.',
  },
  {
    id: '6',
    createdAt: new Date('2026-07-13T16:30:00'),
    language: 'Go',
    summary: 'The goroutine has no synchronization mechanism. Use a WaitGroup or channel to ensure all goroutines complete before the function returns.',
  },
  {
    id: '7',
    createdAt: new Date('2026-07-13T16:30:00'),
    language: 'Go',
    summary: 'The goroutine has no synchronization mechanism. Use a WaitGroup or channel to ensure all goroutines complete before the function returns.',
  },
];

interface ReviewsListProps {
  className?: string;
  showTitle?: boolean;
}

export function ReviewsList({ className = '', showTitle = true }: ReviewsListProps) {
  return (
    <div className={`flex flex-col w-50 min-w-0 border-r border-[#1e1e4a] overflow-hidden ${className}`}>
      {showTitle && (
        <div className="px-3 py-3 border-b border-[#1e1e4a] sticky top-0 left-0 bg-[#0a0a23]">
          <span className="uppercase text-sm font-semibold tracking-wide text-[#6c6cff]">Reviews history</span>
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col">
        {MOCK_REVIEWS.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
