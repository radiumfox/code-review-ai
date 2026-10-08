'use client';

import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store';
import {
  deleteReviews,
  selectDeleteReviewsError,
  selectDeleteReviewsLoading
} from '@/store/reviewEditorStore';
import { NotificationType, useNotification } from '@/lib/notifications';

export function useDeleteReviews() {
  const deleteLoading = useSelector(selectDeleteReviewsLoading);
  const deleteError = useSelector(selectDeleteReviewsError);
  const dispatch = useDispatch<AppDispatch>();
  const { showNotification } = useNotification();

  useEffect(() => {
    if(deleteError) {
      showNotification({
        type: NotificationType.Error,
        message: deleteError.message,
      });
    }
  }, [deleteError, showNotification]);

  const handleDeleteReviews = useCallback((ids: string[]) => {
    if(!ids.length) return;

    dispatch(deleteReviews(ids));
  }, [dispatch]);

  return {
    deleteLoading,
    deleteReviews: handleDeleteReviews,
  };
}
