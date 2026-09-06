import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Review, ReviewGenerateRequest } from '@/lib/types';
import { DEFAULT_EDITOR_VALUE, DEFAULT_LANGUAGE, API_ROUTES } from '@/lib/config';
import type { RootState } from './index';
import type { CodingLanguage } from '@/lib/types/languages';
import { toApiError } from '@/lib/api/errors';
import { isApiFailure, isApiSuccess } from '@/lib/api/result';
import type { ApiError } from '@/lib/api/errors';
import type { ApiSuccess } from '@/lib/api/result';

interface ReviewEditorState {
  currentReview: Review | null;
  createReviewLoading: boolean;
  createReviewError: ApiError | null;
  language: CodingLanguage | null;
  model: string | null;
  codeSnippet: string;
  summary: string;
}

export const initialState: ReviewEditorState = {
  currentReview: null,
  createReviewError: null,
  createReviewLoading: false,
  language: DEFAULT_LANGUAGE,
  model: null,
  codeSnippet: DEFAULT_EDITOR_VALUE,
  summary: '',
};

export const createReview = createAsyncThunk<ApiSuccess<Review>, ReviewGenerateRequest, { rejectValue: ApiError }>(
  'reviews/createReview',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ROUTES.createReview, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(params)
      });

      const responseData: unknown = await response.json().catch(() => null);

      if (isApiFailure(responseData)) {
        return rejectWithValue(responseData);
      }

      if (isApiSuccess<Review>(responseData)) {
        return responseData;
      }

      return rejectWithValue(toApiError({
        ...(typeof responseData === 'object' && responseData !== null ? responseData : {}),
        statusCode: response.status,
      }));
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;

      if (state.reviewEditor.createReviewLoading) {
        return false;
      }
    },
  },
);

export const reviewEditorSlice = createSlice({
  name: 'reviewEditor',
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
    resetCurrentReview: (state, action: PayloadAction<string | null>) => {
      state.currentReview = null;
      state.language = DEFAULT_LANGUAGE;
      state.model = action.payload;
      state.codeSnippet = DEFAULT_EDITOR_VALUE;
      state.summary = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReview.pending, (state) => {
        state.createReviewLoading = true;
        state.summary = '';
        state.createReviewError = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.createReviewLoading = false;
        state.currentReview = action.payload.data;
        state.codeSnippet = action.payload.data?.codeSnippet ?? DEFAULT_EDITOR_VALUE;
        state.summary = action.payload.data?.summary ?? '';
        state.language = action.payload.data?.language ?? null;
        state.model = action.payload.data?.model ?? null;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.createReviewLoading = false;
        state.createReviewError = action.payload ?? null;
      });
  },
});

export const { setCurrentReview, setLanguage, setModel, setCodeSnippet, setSummary, resetCurrentReview } = reviewEditorSlice.actions;

export const selectCurrentReview = (state: RootState) => state.reviewEditor.currentReview;
export const selectCreateReviewLoading = (state: RootState) => state.reviewEditor.createReviewLoading;
export const selectCreateReviewError = (state: RootState) => state.reviewEditor.createReviewError;

export const selectLang = (state: RootState) => state.reviewEditor.language;
export const selectModel = (state: RootState) => state.reviewEditor.model;
export const selectCodeSnippet = (state: RootState) => state.reviewEditor.codeSnippet;
export const selectSummary = (state: RootState) => state.reviewEditor.summary;
