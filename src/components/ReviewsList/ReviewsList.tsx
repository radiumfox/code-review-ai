'use client';

import { ReviewItem } from './ReviewItem';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store';
import {
  fetchReviews,
  selectReviews,
  selectReviewsLoading,
  selectReviewsError,
  selectCurrentPage,
  selectHasMore,
} from '@/store/reviewsStore';
import { ReviewPreloader } from '@/components/ReviewsList/ReviewPreloader';
import { useInfiniteScroll } from '@/lib/hooks';
import { SpinnerBase } from '@/components/SpinnerBase';

interface ReviewsListProps {
  className?: string;
  showTitle?: boolean;
}

export function ReviewsList({ className = '', showTitle = true }: ReviewsListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector(selectReviews);
  const loading = useSelector(selectReviewsLoading);
  const error = useSelector(selectReviewsError);
  const currentPage = useSelector(selectCurrentPage);
  const hasMore = useSelector(selectHasMore);

  const nextPage = currentPage + 1;

  useEffect(() => {
    if (reviews.length === 0) {
      dispatch(fetchReviews({ page: 0 }));
    }
  }, [dispatch, reviews.length]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;

    dispatch(fetchReviews({ page: nextPage }));
  }, [dispatch, hasMore, loading, nextPage]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useInfiniteScroll(sentinelRef, loadMore, hasMore);

  const reviewsList = useMemo(() => {
    return reviews.map((review, index) => ({
      id: index.toString(),
      ...review,
      createdAt: new Date(review.createdAt),
    }));
  }, [reviews]);

  return (
    <div className={`flex flex-col w-50 min-w-0 border-r border-[#1e1e4a] overflow-hidden ${className}`}>
      {showTitle && (
        <div className="px-3 py-3 border-b border-[#1e1e4a] sticky top-0 left-0 bg-[#0a0a23]">
          <span className="uppercase text-md font-semibold tracking-wide text-[#6c6cff]">Reviews history</span>
        </div>
      )}

      {error ? (
        <div className="flex-1 flex items-center justify-center px-3 py-6">
          <p className="text-xs text-[#ff5555] text-center">{error}</p>
        </div>
      ) : loading && reviewsList.length === 0 ? (
        <div className="flex flex-col">
          {[0, 1, 2].map((index) => (
            <ReviewPreloader key={index} />
          ))}
        </div>
      ) : reviewsList.length > 0 ? (
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col h-[calc(100%-49px)]">
          {reviewsList.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
          {hasMore && (
            <div ref={sentinelRef}>
              <SpinnerBase />
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center px-3 py-6">
          <p className="text-sm text-gray-500 text-center">No reviews yet</p>
        </div>
      )}
    </div>
  );
}
