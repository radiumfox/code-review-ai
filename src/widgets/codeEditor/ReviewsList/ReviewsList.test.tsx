import { describe, expect, test, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { ReviewsList } from './ReviewsList';
import {
  reviewsListSlice,
  initialState as reviewsListInitialState
} from '@/store/reviewsListStore';
import {
  reviewEditorSlice,
  initialState as reviewEditorInitialState,
  deleteReviews
} from '@/store/reviewEditorStore';
import { NotificationProvider } from '@/lib/providers/notifications';
import { ModalProvider } from '@/lib/providers/modal';
import { DEFAULT_LANGUAGE } from '@/lib/config';
import { AI_MODEL } from '@/lib/genAI/openai/config';
import type { Review } from '@/lib/types';

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null }),
}));

function createMockReview(overrides: Partial<Review> = {}): Review {
  return {
    id: 'rev-1',
    summary: 'Test summary',
    issues: [],
    createdAt: '2025-01-01T00:00:00.000Z',
    language: DEFAULT_LANGUAGE,
    codeSnippet: 'const x = 1;',
    model: AI_MODEL,
    ...overrides,
  };
}

function createTestStore(reviews: Review[]) {
  return configureStore({
    reducer: {
      reviewsList: reviewsListSlice.reducer,
      reviewEditor: reviewEditorSlice.reducer,
    },
    preloadedState: {
      reviewsList: {
        ...reviewsListInitialState,
        reviews,
        isInitialReviewsFetching: false,
        hasMore: false,
      },
      reviewEditor: reviewEditorInitialState,
    },
  });
}

function renderReviewsList(store: ReturnType<typeof createTestStore>) {
  return render(
    <Provider store={store}>
      <NotificationProvider>
        <ModalProvider>
          <ReviewsList />
        </ModalProvider>
      </NotificationProvider>
    </Provider>
  );
}

describe('ReviewsList select mode', () => {
  afterEach(() => {
    cleanup();
  });

  test('Enables delete button when reviews are selected', () => {
    const store = createTestStore([
      createMockReview({ id: '1' }),
      createMockReview({ id: '2' }),
    ]);

    renderReviewsList(store);

    fireEvent.click(screen.getByRole('button', { name: 'Enable select mode' }));

    const deleteButton = screen.getByRole('button', { name: 'Delete selected' });
    expect(deleteButton.hasAttribute('disabled')).toBe(true);

    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    fireEvent.click(screen.getAllByRole('checkbox')[1]);

    expect(screen.getByRole('button', { name: 'Delete selected' }).hasAttribute('disabled')).toBe(false);
  });

  test('Disables delete button when selected reviews are deleted', () => {
    const store = createTestStore([
      createMockReview({ id: '1' }),
      createMockReview({ id: '2' }),
      createMockReview({ id: '3' }),
    ]);

    renderReviewsList(store);

    fireEvent.click(screen.getByRole('button', { name: 'Enable select mode' }));
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    fireEvent.click(screen.getAllByRole('checkbox')[1]);

    expect(screen.getByRole('button', { name: 'Delete selected' }).hasAttribute('disabled')).toBe(false);

    act(() => {
      store.dispatch(deleteReviews.fulfilled(
        { ok: true, data: { deletedCount: 2, deletedIds: ['1', '2'] } },
        'request-id',
        ['1', '2'],
      ));
    });

    expect(screen.getAllByRole('checkbox')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Delete selected' }).hasAttribute('disabled')).toBe(true);
  });
});
