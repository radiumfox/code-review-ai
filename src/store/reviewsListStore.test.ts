import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
  reviewsListSlice,
  fetchReviews,
  initialState,
  selectReviews,
  selectReviewsLoading,
  selectReviewsError,
  selectCurrentPage,
  selectHasMore,
  selectIsInitialReviewsFetching,
} from '@/store/reviewsListStore';
import {
  reviewEditorSlice,
  createReview,
} from '@/store/reviewEditorStore';
import type { RootState } from '@/store';
import { DEFAULT_LANGUAGE, REVIEWS_LIST_LIMIT } from '@/lib/config';
import { AI_MODEL } from '@/lib/genAI/openai/config';
import type { Review } from '@/lib/types';
import { ERROR_CODES, FALLBACK_STATUS_CODE, STATUS_CODE_BY_CODE } from '@/lib/api/errors';

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

function asRootState(sliceState: ReturnType<typeof reviewsListSlice.reducer>): RootState {
  return {
    reviewsList: sliceState,
    reviewEditor: reviewEditorSlice.reducer(undefined, { type: 'init' }),
  };
}

function createTestStore() {
  return configureStore({
    reducer: {
      reviewsList: reviewsListSlice.reducer,
      reviewEditor: reviewEditorSlice.reducer,
    },
  });
}

const fetchMock = vi.fn();

describe('Selectors', () => {
  test('Return correct values from initialState', () => {
    const state = asRootState(initialState);

    expect(selectReviews(state)).toEqual([]);
    expect(selectReviewsLoading(state)).toBe(false);
    expect(selectReviewsError(state)).toBeNull();
    expect(selectCurrentPage(state)).toBe(-1);
    expect(selectHasMore(state)).toBe(true);
    expect(selectIsInitialReviewsFetching(state)).toBe(true);
  });
});

describe('extraReducers - fetchReviews', () => {
  let state: ReturnType<typeof reviewsListSlice.reducer>;

  beforeEach(() => {
    state = initialState;
  });

  test('Pending sets loading true and clears error', () => {
    state = reviewsListSlice.reducer(state, { type: fetchReviews.pending.type });
    const root = asRootState(state);

    expect(selectReviewsLoading(root)).toBe(true);
    expect(selectReviewsError(root)).toBeNull();
  });

  describe('fulfilled', () => {
    test('Initial fetch replaces reviews and sets page to 0', () => {
      const reviews = [
        createMockReview({ id: '1' }),
        createMockReview({ id: '2' })
      ];

      state = reviewsListSlice.reducer(state, {
        type: fetchReviews.fulfilled.type,
        payload: { reviews, fetchId: 0, page: 0 },
      });

      const root = asRootState(state);

      expect(selectReviews(root)).toEqual(reviews);
      expect(selectCurrentPage(root)).toBe(0);
      expect(selectIsInitialReviewsFetching(root)).toBe(false);
      expect(selectReviewsLoading(root)).toBe(false);
    });

    test('Subsequent page appends reviews', () => {
      const initial = [createMockReview({ id: '1' })];

      state = reviewsListSlice.reducer(state, {
        type: fetchReviews.fulfilled.type,
        payload: { reviews: initial, fetchId: 0, page: 0 },
      });

      const more = [createMockReview({ id: '2' })];

      state = reviewsListSlice.reducer(state, {
        type: fetchReviews.fulfilled.type,
        payload: { reviews: more, fetchId: 0, page: 1 },
      });

      expect(selectReviews(asRootState(state))).toHaveLength(2);
      expect(selectCurrentPage(asRootState(state))).toBe(1);
    });

    test('hasMore is true when reviews length equals page limit', () => {
      const reviews = Array.from({ length: REVIEWS_LIST_LIMIT }, (_, i) => createMockReview({ id: String(i) }));

      state = reviewsListSlice.reducer(state, {
        type: fetchReviews.fulfilled.type,
        payload: { reviews, fetchId: 0, page: 0 },
      });

      expect(selectHasMore(asRootState(state))).toBe(true);
    });

    test('hasMore is false when reviews length is less than page limit', () => {
      const reviews = [createMockReview({ id: '1' })];

      state = reviewsListSlice.reducer(state, {
        type: fetchReviews.fulfilled.type,
        payload: { reviews, fetchId: 0, page: 0 },
      });

      expect(selectHasMore(asRootState(state))).toBe(false);
    });

    test('Ignores stale fetchId', () => {
      const reviews = [createMockReview({ id: '1' })];

      state = reviewsListSlice.reducer(state, {
        type: fetchReviews.fulfilled.type,
        payload: { reviews, fetchId: 999, page: 0 },
      });

      expect(selectReviews(asRootState(state))).toEqual([]);
      expect(selectIsInitialReviewsFetching(asRootState(state))).toBe(true);
    });
  });

  test('rejected sets error and loading false', () => {
    state = reviewsListSlice.reducer(state, {
      type: fetchReviews.rejected.type,
      payload: {
        message: 'Network error',
        code: ERROR_CODES.NETWORK,
        statusCode: FALLBACK_STATUS_CODE,
        ok: false,
      },
    });

    const root = asRootState(state);

    expect(selectReviewsLoading(root)).toBe(false);
    expect(selectReviewsError(root)).toEqual({
      message: 'Network error',
      code: ERROR_CODES.NETWORK,
      statusCode: FALLBACK_STATUS_CODE,
      ok: false,
    });
  });
});

describe('extraReducers - createReview cross-slice', () => {
  test('fulfilled sets isInitialReviewsFetching to trigger list refetch', () => {
    const reviews = [createMockReview({ id: '1' })];

    let state = reviewsListSlice.reducer(initialState, {
      type: fetchReviews.fulfilled.type,
      payload: { reviews, fetchId: 0, page: 0 },
    });

    expect(selectIsInitialReviewsFetching(asRootState(state))).toBe(false);

    state = reviewsListSlice.reducer(state, {
      type: createReview.fulfilled.type,
      payload: createMockReview(),
    });

    expect(selectIsInitialReviewsFetching(asRootState(state))).toBe(true);
  });
});

describe('selector-reducer contract', () => {
  test('Selectors reflect state after fetchReviews fulfilled', () => {
    const reviews = [createMockReview({ id: '1' }), createMockReview({ id: '2' })];

    const state = reviewsListSlice.reducer(initialState, {
      type: fetchReviews.fulfilled.type,
      payload: { reviews, fetchId: 0, page: 0 },
    });
    const root = asRootState(state);

    expect(selectReviews(root)).toEqual(reviews);
    expect(selectIsInitialReviewsFetching(root)).toBe(false);
    expect(selectCurrentPage(root)).toBe(0);
    expect(selectHasMore(root)).toBe(false);
    expect(selectReviewsLoading(root)).toBe(false);
  });
});

describe('async thunks', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchReviews', () => {
    test('Dispatches fulfilled with reviews on success', async () => {
      const reviews = [createMockReview({ id: '1' })];
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          ok: true,
          data: {
            metadata: {
              totalCount: reviews.length,
              page: 0,
              pageSize: REVIEWS_LIST_LIMIT,
            },
            data: reviews,
          },
        }),
      });

      const store = createTestStore();
      await store.dispatch(fetchReviews({ page: 0 }));

      const state = store.getState();
      expect(selectReviews(state)).toEqual(reviews);
      expect(selectReviewsLoading(state)).toBe(false);
    });

    test('Dispatches rejected on API error response', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: STATUS_CODE_BY_CODE[ERROR_CODES.INTERNAL_SERVER],
        json: () => Promise.resolve({ error: 'Server error' }),
      });

      const store = createTestStore();
      await store.dispatch(fetchReviews({ page: 0 }));

      const state = store.getState();
      expect(selectReviewsError(state)).toEqual({
        message: 'Server error',
        code: ERROR_CODES.INTERNAL_SERVER,
        statusCode: STATUS_CODE_BY_CODE[ERROR_CODES.INTERNAL_SERVER],
        ok: false,
      });
      expect(selectReviewsLoading(state)).toBe(false);
    });

    test('Dispatches rejected on network failure', async () => {
      fetchMock.mockRejectedValue(new Error('Network failure'));

      const store = createTestStore();
      await store.dispatch(fetchReviews({ page: 0 }));

      const state = store.getState();
      expect(selectReviewsError(state)).toEqual({
        message: 'Network failure',
        code: ERROR_CODES.NETWORK,
        statusCode: FALLBACK_STATUS_CODE,
        ok: false,
      });
    });
  });
});
