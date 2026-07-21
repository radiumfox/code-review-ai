import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Review, ReviewGenerateRequest } from '@/lib/types';
import { DEFAULT_LANGUAGE, REVIEWS_LIST_LIMIT } from '@/lib/config';
import type { RootState } from './index';
import type { CodingLanguage } from '@/lib/types/languages';

interface ReviewState {
  currentReview: Review | null;
  reviews: Review[];
  currentPage: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  createReviewLoading: boolean;
  createReviewError: string | null;
  language: CodingLanguage;
  model: string;
}

const initialState: ReviewState = {
  currentReview: null,
  reviews: [],
  currentPage: -1,
  hasMore: true,
  loading: false,
  error: null,
  createReviewError: null,
  createReviewLoading: false,
  language: DEFAULT_LANGUAGE,
  model: ''
};

export const fetchReviews = createAsyncThunk<Review[], { page: number }>(
  'reviews/fetchReviews',
  async ({ page }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ page }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error ?? 'Error fetching reviews');
      }

      return data.data as Review[];
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching reviews';

      return rejectWithValue(message);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;

      if(state.reviews.loading) {
        return false;
      }
    },
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

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error ?? 'Error creating review');
      }

      return data.data as Review;
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
    },
    setLanguage: (state, action: PayloadAction<CodingLanguage>) => {
      state.language = action.payload;
    },
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;

        state.reviews = [...state.reviews, ...action.payload];
        state.currentPage = action.meta.arg.page;
        state.hasMore = action.payload.length === REVIEWS_LIST_LIMIT;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Error fetching reviews';
      })
      .addCase(createReview.pending, (state) => {
        state.createReviewLoading = true;
        state.createReviewError = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.createReviewLoading = false;
        state.currentReview = action.payload;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.createReviewLoading = false;
        state.createReviewError = (action.payload as string) ?? 'Error creating review';
      });
  },
});

export const { setCurrentReview, setLanguage, setModel } = reviewsSlice.actions;

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
