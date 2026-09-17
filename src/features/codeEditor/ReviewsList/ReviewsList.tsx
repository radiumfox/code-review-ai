'use client';

import { ReviewItem } from './ReviewItem';
import { CreateReviewButton } from './CreateReviewButton';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import type { AppDispatch } from '@/store';
import {
  fetchReviews,
  selectReviews,
  selectReviewsLoading,
  selectReviewsError,
  selectCurrentPage,
  selectHasMore,
  selectIsInitialReviewsFetching
} from '@/store/reviewsListStore';
import {
  setCurrentReview,
  resetCurrentReview,
  selectCurrentReview
} from '@/store/reviewEditorStore';
import { ReviewPreloader } from './ReviewPreloader';
import { useInfiniteScroll } from '@/lib/hooks';
import { SpinnerBase } from '@/components/SpinnerBase';
import { CheckboxBase } from '@/components/CheckboxBase';
import { ButtonIcon } from '@/components/ButtonIcon';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import { LANGUAGES_NAMES_MAP } from '@/lib/config';
import { Review } from '@/lib/types';

interface ReviewsListProps {
  className?: string;
  showTitle?: boolean;
  onReviewClick?: () => void;
}

export function ReviewsList({ className = '', showTitle = true, onReviewClick = () => {} }: ReviewsListProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [checkedReviewIds, setCheckedReviewIds] = useState<string[]>([]);

  const { data: session } = useSession();

  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector(selectReviews);
  const loading = useSelector(selectReviewsLoading);
  const error = useSelector(selectReviewsError);
  const currentPage = useSelector(selectCurrentPage);
  const hasMore = useSelector(selectHasMore);
  const isInitialLoading = useSelector(selectIsInitialReviewsFetching);
  const currentReview = useSelector(selectCurrentReview);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const nextPage = currentPage + 1;

  const reviewsList = useMemo(() => {
    return reviews.map((review) => {
      return {
        ...review,
        languageTitle: LANGUAGES_NAMES_MAP[review.language] ?? review.language,
      };
    });
  }, [reviews]);

  const createNewReview = useCallback(() => {
    dispatch(resetCurrentReview(session?.user?.aiModel ?? null));
  }, [dispatch, session?.user?.aiModel]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;

    dispatch(fetchReviews({ page: nextPage }));
  }, [dispatch, hasMore, loading, nextPage]);

  const onReviewItemClick = useCallback((review: Review) => {
    dispatch(setCurrentReview(review));
    onReviewClick();
  }, [dispatch]);

  const onCheckboxChange = useCallback((reviewId: string) => {
    setCheckedReviewIds(prevCheckedReviewIds => {
      if (prevCheckedReviewIds.includes(reviewId)) {
        return prevCheckedReviewIds.filter(id => id !== reviewId);
      }
      return [...prevCheckedReviewIds, reviewId];
    });
  }, []);

  useEffect(() => {
    if(!reviews.length) {
      dispatch(fetchReviews({ page: 0 }));
    }
  }, [dispatch, reviews.length]);

  useInfiniteScroll(sentinelRef, loadMore, hasMore);

  return (
    <div className={`flex flex-col min-w-0 border-r border-[#1e1e4a] overflow-hidden transition-[width] ${isOpen ? 'w-50' : 'w-[60px]'} ${className}`}>
      <div className={`px-3 py-3 border-b border-[#1e1e4a] bg-[#0a0a23] flex items-center gap-2 ${isOpen && showTitle ? 'justify-between sticky top-0 left-0' : 'justify-center'}`}>
        {isOpen && showTitle && (
          <span className="uppercase text-md font-semibold tracking-wide text-accent">Reviews history</span>
        )}
        <ButtonIcon
          icon={<ArrowRightIcon className={`w-4 h-4 ${isOpen ? 'rotate-180' : ''}`} />}
          onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)}
          ariaLabel={isOpen ? 'Collapse reviews list' : 'Expand reviews list'}
        />
      </div>

      {isOpen && (
        error ? (
          <div className="flex-1 flex items-center justify-center px-3 py-6">
            <p className="text-body text-destructive text-center">{error.message}</p>
          </div>
        ) : isInitialLoading && loading ? (
          <div className="flex flex-col">
            {[0, 1, 2].map((index) => (
              <ReviewPreloader key={index} />
            ))}
          </div>
        ) : reviewsList.length > 0 ? (
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col h-[calc(100%-49px)]">
            <CreateReviewButton
              isActive={currentReview === null}
              onClick={createNewReview}
            />
            {reviewsList.map((review) => (
              <ReviewItem
                onClick={() => onReviewItemClick(review)}
                key={review.id}
                review={review}
                isActive={review.id === currentReview?.id}
                languageTitle={review.languageTitle}
              >
                <CheckboxBase
                  id={`review-check-${review.id}`}
                  isChecked={checkedReviewIds.includes(review.id)}
                  onChange={() => onCheckboxChange(review.id)}
                />
              </ReviewItem>
            ))}
            {hasMore && (
              <div ref={sentinelRef}>
                <SpinnerBase />
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <CreateReviewButton
              isActive={currentReview === null}
              onClick={createNewReview}
            />
            <div className="flex-1 flex items-center justify-center px-3 py-6">
              <p className="text-body text-gray-500 text-center">No reviews yet</p>
            </div>
          </div>
        )
      )}

      {isOpen && (
        <div className="mt-auto h-[60px] border-t border-[#1e1e4a]"></div>
      )}
    </div>
  );
}
