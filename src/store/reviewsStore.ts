import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Review, ReviewGenerateRequest } from '@/lib/types';
import { DEFAULT_EDITOR_VALUE, DEFAULT_LANGUAGE, DEFAULT_MODEL, REVIEWS_LIST_LIMIT } from '@/lib/config';
import type { RootState } from './index';
import type { CodingLanguage } from '@/lib/types/languages';

interface ReviewState {
  currentReview: Review | null;
  reviews: Review[];
  currentPage: number;
  hasMore: boolean;
  loading: boolean;
  isInitialReviewsFetching: boolean;
  error: string | null;
  createReviewLoading: boolean;
  createReviewError: string | null;
  language: CodingLanguage | null;
  model: string | null;
  codeSnippet: string;
  summary: string;
}

export const initialState: ReviewState = {
  currentReview: null,
  reviews: [],
  isInitialReviewsFetching: true,
  currentPage: -1,
  hasMore: true,
  loading: false,
  error: null,
  createReviewError: null,
  createReviewLoading: false,
  language: 'js',
  model: 'gemini-2.5-flash',
  codeSnippet: DEFAULT_EDITOR_VALUE,
  summary: '',
};

interface FetchReviewsResult {
  reviews: Review[];
  fetchId: number;
  page: number;
}

let fetchReviewsCounter = 0;

export const fetchReviews = createAsyncThunk<FetchReviewsResult, { page: number }>(
  'reviews/fetchReviews',
  async ({ page }, { rejectWithValue }) => {
    const fetchId = ++fetchReviewsCounter;

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ page }),
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result.error ?? 'Error fetching reviews');
      }

      return { reviews: result.data as Review[], fetchId, page };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching reviews';

      return rejectWithValue(message);
    }
  },
);

export const createReview = createAsyncThunk<Review, ReviewGenerateRequest>(
  'reviews/createReview',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(params)
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result.error ?? 'Error creating review');
      }

      return result.data as Review;
    } catch(error) {
      const message = error instanceof Error ? error.message : 'Error creating review';

      return rejectWithValue(message);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;

      if(state.reviews.createReviewLoading) {
        return false;
      }
    },
  },
);

export const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setCurrentReview: (state, action: PayloadAction<Review | null>) => {
      state.currentReview = action.payload;
      state.language = action.payload?.language ?? null;
      state.model = action.payload?.model ?? null;
      state.codeSnippet = action.payload?.codeSnippet ?? '';
      state.summary = action.payload?.summary ?? '';
    },
    setLanguage: (state, action: PayloadAction<CodingLanguage>) => {
      state.language = action.payload;
    },
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
    },
    setCodeSnippet: (state, action: PayloadAction<string>) => {
      state.codeSnippet = action.payload;
    },
    setSummary: (state, action: PayloadAction<string>) => {
      state.summary = action.payload;
    },
    resetCurrentReview: (state) => {
      state.currentReview = null;
      state.language = DEFAULT_LANGUAGE;
      state.model = DEFAULT_MODEL;
      state.codeSnippet = DEFAULT_EDITOR_VALUE;
      state.summary = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        if(action.payload.fetchId !== fetchReviewsCounter) return;

        if(state.isInitialReviewsFetching) {
          state.reviews = action.payload.reviews;
          state.currentPage = 0;
          state.isInitialReviewsFetching = false;
        } else {
          state.reviews = [...state.reviews, ...action.payload.reviews];
          state.currentPage = action.payload.page;
        }

        state.hasMore = action.payload.reviews.length === REVIEWS_LIST_LIMIT;
        state.loading = false;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Error fetching reviews';
      })
      .addCase(createReview.pending, (state) => {
        state.createReviewLoading = true;
        state.summary = '';
        state.createReviewError = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isInitialReviewsFetching = true;
        state.createReviewLoading = false;
        state.currentReview = action.payload;
        state.codeSnippet = action.payload?.codeSnippet ?? DEFAULT_EDITOR_VALUE;
        state.summary = action.payload?.summary ?? '';
        state.language = action.payload?.language ?? null;
        state.model = action.payload?.model ?? null;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.createReviewLoading = false;
        state.createReviewError = (action.payload as string) ?? 'Error creating review';
      });
  },
});

export const { setCurrentReview, setLanguage, setModel, setCodeSnippet, setSummary, resetCurrentReview } = reviewsSlice.actions;

export const selectReviews = (state: RootState) => state.reviews.reviews;
export const selectReviewsLoading = (state: RootState) => state.reviews.loading;
export const selectReviewsError = (state: RootState) => state.reviews.error;
export const selectCurrentPage = (state: RootState) => state.reviews.currentPage;
export const selectHasMore = (state: RootState) => state.reviews.hasMore;
export const selectCurrentReview = (state: RootState) => state.reviews.currentReview;
export const selectCreateReviewLoading = (state: RootState) => state.reviews.createReviewLoading;
export const selectCreateReviewError = (state: RootState) => state.reviews.createReviewError;

export const selectLang = (state: RootState) => state.reviews.language;
export const selectModel = (state: RootState) => state.reviews.model;
export const selectCodeSnippet = (state: RootState) => state.reviews.codeSnippet;
export const selectSummary = (state: RootState) => state.reviews.summary;

export const selectIsInitialReviewsFetching = (state: RootState) => state.reviews.isInitialReviewsFetching;
