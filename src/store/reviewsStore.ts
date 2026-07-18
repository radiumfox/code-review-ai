import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Review } from '@/lib/createReviewService/types';
import type { RootState } from './index';

interface ReviewState {
  currentReview: Review | null;
  reviews: Review[];
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  currentReview: null,
  reviews: [],
  currentPage: 0,
  loading: false,
  error: null,
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

      return data as Review[];
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching reviews';

      return rejectWithValue(message);
    }
  }
);

export const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setCurrentReview: (state, action: PayloadAction<Review | null>) => {
      state.currentReview = action.payload;
    },
    setReviewsList: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
        state.currentPage = action.meta.arg.page;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Error fetching reviews';
      });
  },
});

export const { setCurrentReview, setReviewsList, setCurrentPage } = reviewsSlice.actions;

export const selectReviews = (state: RootState) => state.reviews.reviews;
export const selectReviewsLoading = (state: RootState) => state.reviews.loading;
export const selectReviewsError = (state: RootState) => state.reviews.error;
export const selectCurrentPage = (state: RootState) => state.reviews.currentPage;