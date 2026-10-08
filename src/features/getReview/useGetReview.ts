'use client';

import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store';
import {
  createReview,
  selectCodeSnippet,
  selectCreateReviewError,
  selectCreateReviewLoading,
  selectLang,
  selectModel
} from '@/store/reviewEditorStore';
import { fetchReviews } from '@/store/reviewsListStore';
import { NotificationType, useNotification } from '@/lib/notifications';

export function useGetReview() {
  const language = useSelector(selectLang);
  const model = useSelector(selectModel);
  const codeSnippet = useSelector(selectCodeSnippet);
  const reviewLoading = useSelector(selectCreateReviewLoading);
  const reviewError = useSelector(selectCreateReviewError);
  const dispatch = useDispatch<AppDispatch>();
  const { showNotification } = useNotification();

  useEffect(() => {
    if(reviewError) {
      showNotification({
        type: NotificationType.Error,
        message: reviewError.message,
      });
    }
  }, [reviewError, showNotification]);

  const getReview = useCallback(() => {
    if(!language || !model) {
      showNotification({
        type: NotificationType.Error,
        message: 'Language or model is missing',
      });

      return;
    }

    dispatch(createReview({
      language,
      codeSnippet,
      model
    })).then((result) => {
      if(result.payload?.ok) {
        dispatch(fetchReviews({ page: 0 }));
      }
    });
  }, [language, model, codeSnippet, dispatch, showNotification]);

  return {
    reviewLoading,
    getReview,
  };
}