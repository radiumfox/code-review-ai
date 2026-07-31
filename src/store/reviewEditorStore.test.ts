import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
  reviewEditorSlice,
  createReview,
  setCurrentReview,
  setLanguage,
  setModel,
  setCodeSnippet,
  setSummary,
  resetCurrentReview,
  initialState,
  selectCurrentReview,
  selectCreateReviewLoading,
  selectCreateReviewError,
  selectLang,
  selectModel,
  selectCodeSnippet,
  selectSummary,
} from '@/store/reviewEditorStore';
import { reviewsListSlice } from '@/store/reviewsListStore';
import type { RootState } from '@/store';
import { DEFAULT_LANGUAGE, DEFAULT_EDITOR_VALUE } from '@/lib/config';
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

function asRootState(sliceState: ReturnType<typeof reviewEditorSlice.reducer>): RootState {
  return {
    reviewsList: reviewsListSlice.reducer(undefined, { type: 'init' }),
    reviewEditor: sliceState,
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

    expect(selectCurrentReview(state)).toBeNull();
    expect(selectCreateReviewLoading(state)).toBe(false);
    expect(selectCreateReviewError(state)).toBeNull();
    expect(selectLang(state)).toBe(DEFAULT_LANGUAGE);
    expect(selectModel(state)).toBe(AI_MODEL);
    expect(selectCodeSnippet(state)).toBe(DEFAULT_EDITOR_VALUE);
    expect(selectSummary(state)).toBe('');
  });
});

describe('Synchronous reducers', () => {
  let state: ReturnType<typeof reviewEditorSlice.reducer>;

  beforeEach(() => {
    state = initialState;
  });

  describe('setCurrentReview', () => {
    test('Sets review and updates all fields', () => {
      const review = createMockReview({ language: 'py', model: 'other-model', codeSnippet: 'print(1)', summary: 'Looks good' });
      state = reviewEditorSlice.reducer(state, setCurrentReview(review));
      const root = asRootState(state);

      expect(selectCurrentReview(root)).toEqual(review);
      expect(selectLang(root)).toBe('py');
      expect(selectModel(root)).toBe('other-model');
      expect(selectCodeSnippet(root)).toBe('print(1)');
      expect(selectSummary(root)).toBe('Looks good');
    });

    test('Resets fields to defaults when null', () => {
      state = reviewEditorSlice.reducer(state, setCurrentReview(createMockReview()));
      state = reviewEditorSlice.reducer(state, setCurrentReview(null));
      const root = asRootState(state);

      expect(selectCurrentReview(root)).toBeNull();
      expect(selectLang(root)).toBeNull();
      expect(selectModel(root)).toBeNull();
      expect(selectCodeSnippet(root)).toBe('');
      expect(selectSummary(root)).toBe('');
    });
  });

  test('setLanguage updates language', () => {
    state = reviewEditorSlice.reducer(state, setLanguage('py'));
    expect(selectLang(asRootState(state))).toBe('py');
  });

  test('setModel updates model', () => {
    state = reviewEditorSlice.reducer(state, setModel('other-model'));
    expect(selectModel(asRootState(state))).toBe('other-model');
  });

  test('setCodeSnippet updates codeSnippet', () => {
    state = reviewEditorSlice.reducer(state, setCodeSnippet('console.log(1)'));
    expect(selectCodeSnippet(asRootState(state))).toBe('console.log(1)');
  });

  test('setSummary updates summary', () => {
    state = reviewEditorSlice.reducer(state, setSummary('Needs work'));
    expect(selectSummary(asRootState(state))).toBe('Needs work');
  });

  describe('resetCurrentReview', () => {
    test('Reverts all fields to initialState defaults', () => {
      state = reviewEditorSlice.reducer(state, setCurrentReview(createMockReview({
        language: 'py',
        model: 'other',
        codeSnippet: 'x = 1',
        summary: 'Changed',
      })));

      state = reviewEditorSlice.reducer(state, resetCurrentReview());
      const root = asRootState(state);

      expect(selectCurrentReview(root)).toBeNull();
      expect(selectLang(root)).toBe(DEFAULT_LANGUAGE);
      expect(selectModel(root)).toBe(AI_MODEL);
      expect(selectCodeSnippet(root)).toBe(DEFAULT_EDITOR_VALUE);
      expect(selectSummary(root)).toBe('');
    });
  });
});

describe('extraReducers - createReview', () => {
  let state: ReturnType<typeof reviewEditorSlice.reducer>;

  beforeEach(() => {
    state = initialState;
  });

  test('pending sets loading true, clears summary and error', () => {
    state = reviewEditorSlice.reducer(state, {
      type: createReview.pending.type,
    });
    const root = asRootState(state);

    expect(selectCreateReviewLoading(root)).toBe(true);
    expect(selectSummary(root)).toBe('');
    expect(selectCreateReviewError(root)).toBeNull();
  });

  test('fulfilled sets currentReview and updates all fields', () => {
    const review = createMockReview({ language: 'py', codeSnippet: 'print(1)', summary: 'Great code' });

    state = reviewEditorSlice.reducer(state, {
      type: createReview.fulfilled.type,
      payload: review,
    });
    const root = asRootState(state);

    expect(selectCreateReviewLoading(root)).toBe(false);
    expect(selectCurrentReview(root)).toEqual(review);
    expect(selectLang(root)).toBe('py');
    expect(selectCodeSnippet(root)).toBe('print(1)');
    expect(selectSummary(root)).toBe('Great code');
  });

  test('rejected sets error and loading false', () => {
    state = reviewEditorSlice.reducer(state, {
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
    const state = reviewEditorSlice.reducer(initialState, setCurrentReview(review));
    const root = asRootState(state);

    expect(selectCurrentReview(root)).toEqual(review);
    expect(selectLang(root)).toBe('py');
    expect(selectModel(root)).toBe('gpt-4');
    expect(selectCodeSnippet(root)).toBe('x=1');
    expect(selectSummary(root)).toBe('ok');
  });

  test('Selectors reflect state after createReview.fulfilled', () => {
    const review = createMockReview({ summary: 'All good' });
    const state = reviewEditorSlice.reducer(initialState, {
      type: createReview.fulfilled.type,
      payload: review,
    });
    const root = asRootState(state);

    expect(selectCurrentReview(root)).toEqual(review);
    expect(selectSummary(root)).toBe('All good');
    expect(selectCreateReviewLoading(root)).toBe(false);
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

      const store = createTestStore();
      store.dispatch({ type: createReview.pending.type });

      await store.dispatch(createReview(params));

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
