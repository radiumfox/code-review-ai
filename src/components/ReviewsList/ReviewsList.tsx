'use client';

import { ReviewItem } from './ReviewItem';
import { useEffect, useMemo } from 'react';
import { useFetch } from '@/lib/hooks';
import { Review } from '@/lib/createReviewService/types';
import { ReviewPreloader } from '@/components/ReviewsList/ReviewPreloader';

interface ReviewsListProps {
  className?: string;
  showTitle?: boolean;
}

export function ReviewsList({ className = '', showTitle = true }: ReviewsListProps) {
  const {
    executeFetch: fetchReviews,
    data: reviews,
    error: reviewsError,
    loading: reviewsLoading
  } = useFetch<{ page: number }, Review[]>('/api/reviews', { method: 'POST' });

  useEffect(() => {
    fetchReviews({ page: 0 });
  }, []);

  const reviewsList = useMemo(() => {
    return reviews?.map((review, index) => ({
      id: index.toString(),
      ...review,
      createdAt: new Date(review.createdAt),
    }))  ?? [];
  }, [reviews]);

  return (
    <div className={`flex flex-col w-50 min-w-0 border-r border-[#1e1e4a] overflow-hidden ${className}`}>
      {showTitle && (
        <div className="px-3 py-3 border-b border-[#1e1e4a] sticky top-0 left-0 bg-[#0a0a23]">
          <span className="uppercase text-md font-semibold tracking-wide text-[#6c6cff]">Reviews history</span>
        </div>
      )}

      {reviewsError ? (
        <div className="flex-1 flex items-center justify-center px-3 py-6">
          <p className="text-xs text-[#ff5555] text-center">{reviewsError}</p>
        </div>
      ) : reviewsLoading ? (
        <div className="flex flex-col">
          {[0, 1, 2].map((index) => (
            <ReviewPreloader key={index} />
          ))}
        </div>
      ) : reviewsList.length > 0 ? (
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col">
          {reviewsList.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center px-3 py-6">
          <p className="text-sm text-gray-500 text-center">No reviews yet</p>
        </div>
      )}
    </div>
  );
}
