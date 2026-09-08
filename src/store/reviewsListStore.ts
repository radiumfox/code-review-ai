import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Review } from '@/lib/types';
import { REVIEWS_LIST_LIMIT, API_ROUTES } from '@/lib/config';
import type { RootState } from './index';
import { createReview } from './reviewEditorStore';
import { toApiError } from '@/lib/api/errors';
import { isApiFailure, isApiSuccess } from '@/lib/api/result';
import type { ApiError } from '@/lib/api/errors';

interface ReviewsListState {
  reviews: Review[];
  currentPage: number;
  hasMore: boolean;
  loading: boolean;
  isInitialReviewsFetching: boolean;
  error: ApiError | null;
}

export const initialState: ReviewsListState = {
  reviews: [],
  isInitialReviewsFetching: true,
  currentPage: -1,
  hasMore: true,
  loading: false,
  error: null,
};

interface ReviewsListResponse {
  metadata: {
    totalCount: number;
    page: number;
    pageSize: number;
  };
  data: Review[];
}

interface FetchReviewsResult {
  ok: boolean;
  data: ReviewsListResponse;
  reviews: Review[];
  fetchId: number;
  page: number;
}

let fetchReviewsCounter = 0;

export const fetchReviews = createAsyncThunk<FetchReviewsResult, { page: number }, { rejectValue: ApiError }>(
  'reviews/fetchReviews',
  async ({ page }, { rejectWithValue }) => {
    const fetchId = ++fetchReviewsCounter;

    try {
      const response = await fetch(API_ROUTES.reviewsList, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ page }),
      });

      const responseData: unknown = await response.json().catch(() => null);

      if (isApiFailure(responseData)) {
        return rejectWithValue(responseData);
      }

      if (isApiSuccess<ReviewsListResponse>(responseData)) {
        return {
          ok: responseData.ok,
          data: responseData.data,
          reviews: responseData.data.data,
          fetchId,
          page,
        };
      }

      return rejectWithValue(toApiError({
        ...(typeof responseData === 'object' && responseData !== null ? responseData : {}),
        statusCode: response.status,
      }));
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const reviewsListSlice = createSlice({
  name: 'reviewsList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        if (action.payload.fetchId !== fetchReviewsCounter) return;

        if (state.isInitialReviewsFetching) {
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
        state.error = action.payload ?? null;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.isInitialReviewsFetching = true;
      });
  },
});

export const selectReviews = (state: RootState) => state.reviewsList.reviews;
export const selectReviewsLoading = (state: RootState) => state.reviewsList.loading;
export const selectReviewsError = (state: RootState) => state.reviewsList.error;
export const selectCurrentPage = (state: RootState) => state.reviewsList.currentPage;
export const selectHasMore = (state: RootState) => state.reviewsList.hasMore;
export const selectIsInitialReviewsFetching = (state: RootState) => state.reviewsList.isInitialReviewsFetching;
