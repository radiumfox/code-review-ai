import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
  reviewsSlice,
  fetchReviews,
  createReview,
  setCurrentReview,
  setLanguage,
  setModel,
  setCodeSnippet,
  setSummary,
  resetCurrentReview,
  initialState,
  selectReviews,
  selectReviewsLoading,
  selectReviewsError,
  selectCurrentPage,
  selectHasMore,
  selectCurrentReview,
  selectCreateReviewLoading,
  selectCreateReviewError,
  selectLang,
  selectModel,
  selectCodeSnippet,
  selectSummary,
  selectIsInitialReviewsFetching,
} from '@/store/reviewsStore';
import { DEFAULT_LANGUAGE, DEFAULT_EDITOR_VALUE, REVIEWS_LIST_LIMIT } from '@/lib/config';
import { AI_MODEL } from '@/lib/genAI/config';
import type { Review, ReviewGenerateRequest } from '@/lib/types';

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

function asRootState(sliceState: ReturnType<typeof reviewsSlice.reducer>) {
  return { reviews: sliceState };
}

function createTestStore(preloadedState?: { reviews: ReturnType<typeof reviewsSlice.reducer> }) {
  return configureStore({
    reducer: { reviews: reviewsSlice.reducer },
    preloadedState,
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
    expect(selectCurrentReview(state)).toBeNull();
    expect(selectCreateReviewLoading(state)).toBe(false);
    expect(selectCreateReviewError(state)).toBeNull();
    expect(selectLang(state)).toBe(DEFAULT_LANGUAGE);
    expect(selectModel(state)).toBe(AI_MODEL);
    expect(selectCodeSnippet(state)).toBe(DEFAULT_EDITOR_VALUE);
    expect(selectSummary(state)).toBe('');
    expect(selectIsInitialReviewsFetching(state)).toBe(true);
  });
});

describe('Synchronous reducers', () => {
  let state: ReturnType<typeof reviewsSlice.reducer>;

  beforeEach(() => {
    state = initialState;
  });

  describe('setCurrentReview', () => {
    test('Sets review and updates all fields', () => {
      const review = createMockReview({ language: 'py', model: 'other-model', codeSnippet: 'print(1)', summary: 'Looks good' });
      state = reviewsSlice.reducer(state, setCurrentReview(review));
      const root = asRootState(state);

      expect(selectCurrentReview(root)).toEqual(review);
      expect(selectLang(root)).toBe('py');
      expect(selectModel(root)).toBe('other-model');
      expect(selectCodeSnippet(root)).toBe('print(1)');
      expect(selectSummary(root)).toBe('Looks good');
    });

    test('Resets fields to defaults when null', () => {
      state = reviewsSlice.reducer(state, setCurrentReview(createMockReview()));
      state = reviewsSlice.reducer(state, setCurrentReview(null));
      const root = asRootState(state);

      expect(selectCurrentReview(root)).toBeNull();
      expect(selectLang(root)).toBeNull();
      expect(selectModel(root)).toBeNull();
      expect(selectCodeSnippet(root)).toBe('');
      expect(selectSummary(root)).toBe('');
    });
  });

  test('setLanguage updates language', () => {
    state = reviewsSlice.reducer(state, setLanguage('py'));
    expect(selectLang(asRootState(state))).toBe('py');
  });

  test('setModel updates model', () => {
    state = reviewsSlice.reducer(state, setModel('other-model'));
    expect(selectModel(asRootState(state))).toBe('other-model');
  });

  test('setCodeSnippet updates codeSnippet', () => {
    state = reviewsSlice.reducer(state, setCodeSnippet('console.log(1)'));
    expect(selectCodeSnippet(asRootState(state))).toBe('console.log(1)');
  });

  test('setSummary updates summary', () => {
    state = reviewsSlice.reducer(state, setSummary('Needs work'));
    expect(selectSummary(asRootState(state))).toBe('Needs work');
  });

  describe('resetCurrentReview', () => {
    test('Reverts all fields to initialState defaults', () => {
      state = reviewsSlice.reducer(state, setCurrentReview(createMockReview({
        language: 'py',
        model: 'other',
        codeSnippet: 'x = 1',
        summary: 'Changed',
      })));
            
      state = reviewsSlice.reducer(state, resetCurrentReview());
      const root = asRootState(state);

      expect(selectCurrentReview(root)).toBeNull();
      expect(selectLang(root)).toBe(DEFAULT_LANGUAGE);
      expect(selectModel(root)).toBe(AI_MODEL);
      expect(selectCodeSnippet(root)).toBe(DEFAULT_EDITOR_VALUE);
      expect(selectSummary(root)).toBe('');
    });
  });
});

describe('extraReducers - fetchReviews', () => {
  let state: ReturnType<typeof reviewsSlice.reducer>;

  beforeEach(() => {
    state = initialState;
  });

  test('Pending sets loading true and clears error', () => {
    state = reviewsSlice.reducer(state, { type: fetchReviews.pending.type });
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

      state = reviewsSlice.reducer(state, {
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

      state = reviewsSlice.reducer(state, {
        type: fetchReviews.fulfilled.type,
        payload: { reviews: initial, fetchId: 0, page: 0 },
      });

      const more = [createMockReview({ id: '2' })];

      state = reviewsSlice.reducer(state, {
        type: fetchReviews.fulfilled.type,
        payload: { reviews: more, fetchId: 0, page: 1 },
      });

      expect(selectReviews(asRootState(state))).toHaveLength(2);
      expect(selectCurrentPage(asRootState(state))).toBe(1);
    });

    test('hasMore is true when reviews length equals page limit', () => {
      const reviews = Array.from({ length: REVIEWS_LIST_LIMIT }, (_, i) => createMockReview({ id: String(i) }));

      state = reviewsSlice.reducer(state, {
        type: fetchReviews.fulfilled.type,
        payload: { reviews, fetchId: 0, page: 0 },
      });

      expect(selectHasMore(asRootState(state))).toBe(true);
    });

    test('hasMore is false when reviews length is less than page limit', () => {
      const reviews = [createMockReview({ id: '1' })];

      state = reviewsSlice.reducer(state, {
        type: fetchReviews.fulfilled.type,
        payload: { reviews, fetchId: 0, page: 0 },
      });

      expect(selectHasMore(asRootState(state))).toBe(false);
    });

    test('Ignores stale fetchId', () => {
      const reviews = [createMockReview({ id: '1' })];

      state = reviewsSlice.reducer(state, {
        type: fetchReviews.fulfilled.type,
        payload: { reviews, fetchId: 999, page: 0 },
      });

      expect(selectReviews(asRootState(state))).toEqual([]);
      expect(selectIsInitialReviewsFetching(asRootState(state))).toBe(true);
    });
  });

  test('rejected sets error and loading false', () => {
    state = reviewsSlice.reducer(state, {
      type: fetchReviews.rejected.type,
      payload: 'Network error',
    });

    const root = asRootState(state);

    expect(selectReviewsLoading(root)).toBe(false);
    expect(selectReviewsError(root)).toBe('Network error');
  });
});

describe('extraReducers - createReview', () => {
  let state: ReturnType<typeof reviewsSlice.reducer>;

  beforeEach(() => {
    state = initialState;
  });

  test('pending sets loading true, clears summary and error', () => {
    state = reviewsSlice.reducer(state, {
      type: createReview.pending.type,
    });
    const root = asRootState(state);

    expect(selectCreateReviewLoading(root)).toBe(true);
    expect(selectSummary(root)).toBe('');
    expect(selectCreateReviewError(root)).toBeNull();
  });

  test('fulfilled sets currentReview and updates all fields', () => {
    const review = createMockReview({ language: 'py', codeSnippet: 'print(1)', summary: 'Great code' });

    state = reviewsSlice.reducer(state, {
      type: createReview.fulfilled.type,
      payload: review,
    });
    const root = asRootState(state);

    expect(selectCreateReviewLoading(root)).toBe(false);
    expect(selectCurrentReview(root)).toEqual(review);
    expect(selectLang(root)).toBe('py');
    expect(selectCodeSnippet(root)).toBe('print(1)');
    expect(selectSummary(root)).toBe('Great code');
    expect(selectIsInitialReviewsFetching(root)).toBe(true);
  });

  test('rejected sets error and loading false', () => {
    state = reviewsSlice.reducer(state, {
      type: createReview.rejected.type,
      payload: 'AI service unavailable',
    });
    const root = asRootState(state);

    expect(selectCreateReviewLoading(root)).toBe(false);
    expect(selectCreateReviewError(root)).toBe('AI service unavailable');
  });
});

describe('selector-reducer contract', () => {
  test('Selectors reflect state after setCurrentReview', () => {
    const review = createMockReview({ language: 'py', model: 'gpt-4', codeSnippet: 'x=1', summary: 'ok' });
    const state = reviewsSlice.reducer(initialState, setCurrentReview(review));
    const root = asRootState(state);

    expect(selectCurrentReview(root)).toEqual(review);
    expect(selectLang(root)).toBe('py');
    expect(selectModel(root)).toBe('gpt-4');
    expect(selectCodeSnippet(root)).toBe('x=1');
    expect(selectSummary(root)).toBe('ok');
  });

  test('Selectors reflect state after fetchReviews fulfilled', () => {
    const reviews = [createMockReview({ id: '1' }), createMockReview({ id: '2' })];

    const state = reviewsSlice.reducer(initialState, {
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

  test('Selectors reflect state after createReview.fulfilled', () => {
    const review = createMockReview({ summary: 'All good' });
    const state = reviewsSlice.reducer(initialState, {
      type: createReview.fulfilled.type,
      payload: review,
    });
    const root = asRootState(state);

    expect(selectCurrentReview(root)).toEqual(review);
    expect(selectSummary(root)).toBe('All good');
    expect(selectCreateReviewLoading(root)).toBe(false);
    expect(selectIsInitialReviewsFetching(root)).toBe(true);
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
        json: () => Promise.resolve({ data: reviews }),
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
        json: () => Promise.resolve({ error: 'Server error' }),
      });

      const store = createTestStore();
      await store.dispatch(fetchReviews({ page: 0 }));

      const state = store.getState();
      expect(selectReviewsError(state)).toBe('Server error');
      expect(selectReviewsLoading(state)).toBe(false);
    });

    test('Dispatches rejected on network failure', async () => {
      fetchMock.mockRejectedValue(new Error('Network failure'));

      const store = createTestStore();
      await store.dispatch(fetchReviews({ page: 0 }));

      const state = store.getState();
      expect(selectReviewsError(state)).toBe('Network failure');
    });
  });

  describe('createReview', () => {
    const params: ReviewGenerateRequest = {
      language: DEFAULT_LANGUAGE,
      codeSnippet: 'const x = 1;',
      model: AI_MODEL,
    };

    test('Dispatches fulfilled with created review', async () => {
      const review = createMockReview();
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: review }),
      });

      const store = createTestStore();
      await store.dispatch(createReview(params));

      const state = store.getState();
      expect(selectCurrentReview(state)).toEqual(review);
      expect(selectCreateReviewLoading(state)).toBe(false);
    });

    test('Dispatches rejected on API error', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Validation failed' }),
      });

      const store = createTestStore();
      await store.dispatch(createReview(params));

      const state = store.getState();
      expect(selectCreateReviewError(state)).toBe('Validation failed');
    });

    test('Dispatches rejected on network failure', async () => {
      fetchMock.mockRejectedValue(new Error('Timeout'));

      const store = createTestStore();
      await store.dispatch(createReview(params));

      const state = store.getState();
      expect(selectCreateReviewError(state)).toBe('Timeout');
    });

    test('Does not execute when createReviewLoading is true', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: createMockReview() }),
      });

      const store = createTestStore({
        reviews: reviewsSlice.reducer(undefined, { type: 'init' }),
      });
      store.dispatch({ type: createReview.pending.type });

      await store.dispatch(createReview(params));

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
