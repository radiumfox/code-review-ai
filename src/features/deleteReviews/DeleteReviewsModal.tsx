import { ButtonPrimary } from '@/components/ButtonPrimary';
import { ButtonBorder } from '@/components/ButtonBorder';
import { ModalBase } from '@/components/ModalBase';
import { useDeleteReviews } from './useDeleteReviews';

interface DeleteReviewsModalProps {
    ids: string[];
    isOpen: boolean;
    onClose: () => void;
}

export const DeleteReviewsModal = ({ ids, isOpen, onClose }: DeleteReviewsModalProps) => {
  const {
    deleteLoading,
    deleteReviews
  } = useDeleteReviews();

  const handleConfirmDelete = () => {
    try {
      deleteReviews(ids);
    } finally {
      onClose();
    }
  };

  return (
    <ModalBase
      show={isOpen}
      text={`Are you sure you want to delete ${ids.length} review${ids.length > 1 ? 's' : ''}?`}
    >
      <div className="flex justify-between w-full gap-x-4">
        <ButtonPrimary text="Yes, delete" mode="destructive" onClick={handleConfirmDelete} className="w-full" isLoading={deleteLoading} />
        <ButtonBorder text="Cancel" onClick={() => onClose()} className="w-full" />
      </div>

    </ModalBase>
  );
};