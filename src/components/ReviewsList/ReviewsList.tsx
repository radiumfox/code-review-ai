'use client';

import { ReviewItem } from './ReviewItem';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { useFetch, useInfiniteScroll } from '@/lib/hooks';
import { ReviewPreloader } from '@/components/ReviewsList/ReviewPreloader';
import {
  REVIEWS_ACTION_TYPES,
  ReviewsListState,
  ReviewsListAction,
} from '@/components/ReviewsList/types';
import { Review } from '@/lib/createReviewService/types';
import { REVIEWS_LIST_LIMIT } from '@/lib/config';
import { SpinnerBase } from '@/components/SpinnerBase';

interface ReviewsListProps {
  className?: string;
  showTitle?: boolean;
}

function reviewsListReducer(state: ReviewsListState, action: ReviewsListAction): ReviewsListState {
  switch (action.type) {
  case REVIEWS_ACTION_TYPES.append:
    return {
      reviews: [
        ...state.reviews,
        ...action.payload.reviews,
      ],
      nextPage: action.payload.nextPage !== undefined ? action.payload.nextPage + 1 : 0,
      hasMore: action.payload.reviews.length === REVIEWS_LIST_LIMIT
    };
  }
}

export function ReviewsList({ className = '', showTitle = true }: ReviewsListProps) {
  const [{ reviews, nextPage, hasMore }, dispatch] = useReducer(reviewsListReducer, {
    reviews: [],
    nextPage: 0,
    hasMore: true
  });

  const options = useMemo(() => ({ method: 'POST' as const }), []);

  const {
    executeFetch,
    data,
    loading,
    error,
  } = useFetch<{ page: number }, Review[]>(
    '/api/reviews',
    options
  );

  useEffect(() => {
    executeFetch({ page: nextPage });
  }, []);

  useEffect(() => {
    if (!data) return;

    dispatch({
      type: REVIEWS_ACTION_TYPES.append,
      payload: {
        reviews: data,
        nextPage: nextPage
      },
    });
  }, [data]);

  const loadMore = useCallback(async () => {
    if (nextPage === undefined || !hasMore) return;

    await executeFetch({ page: nextPage });
  }, [nextPage, hasMore, executeFetch]);

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
