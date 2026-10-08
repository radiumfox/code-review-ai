'use client';

import { useCallback } from 'react';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { ButtonBorder } from '@/components/ButtonBorder';
import { useModal } from '@/lib/providers/modal';
import { useDeleteReviews } from './useDeleteReviews';


export function useDeleteReviewsModal() {
  const { showModal, closeModal } = useModal();
  const {
    deleteLoading,
    deleteReviews
  } = useDeleteReviews();

  const showDeleteReviewsModal = useCallback((ids: string[]) => {
    if (!ids.length) return;

    showModal({
      text: `Are you sure you want to delete ${ids.length} review${ids.length > 1 ? 's' : ''}?`,
      actions: (
        <div className="flex justify-between w-full gap-x-4">
          <ButtonPrimary
            text="Yes, delete"
            mode="destructive"
            onClick={() => {
              try {
                deleteReviews(ids);
              } finally {
                closeModal();
              }
            }}
            className="w-full"
            isLoading={deleteLoading}
          />
          <ButtonBorder text="Cancel" onClick={closeModal} className="w-full" />
        </div>
      ),
    });
  }, [showModal, closeModal, deleteLoading, deleteReviews]);

  return showDeleteReviewsModal;
}
