import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Review, ReviewGenerateRequest } from '@/lib/types';
import { DEFAULT_EDITOR_VALUE, DEFAULT_LANGUAGE, API_ROUTES } from '@/lib/config';
import type { RootState } from './index';
import type { CodingLanguage } from '@/lib/types/languages';

interface ReviewEditorState {
  currentReview: Review | null;
  createReviewLoading: boolean;
  createReviewError: string | null;
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

export const createReview = createAsyncThunk<Review, ReviewGenerateRequest>(
  'reviews/createReview',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ROUTES.createReview, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(params)
      });

      const result = await response.json();

      if (!response.ok) {
        return rejectWithValue(result.error ?? 'Error creating review');
      }

      return result.data as Review;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating review';

      return rejectWithValue(message);
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

export const { setCurrentReview, setLanguage, setModel, setCodeSnippet, setSummary, resetCurrentReview } = reviewEditorSlice.actions;

export const selectCurrentReview = (state: RootState) => state.reviewEditor.currentReview;
export const selectCreateReviewLoading = (state: RootState) => state.reviewEditor.createReviewLoading;
export const selectCreateReviewError = (state: RootState) => state.reviewEditor.createReviewError;

export const selectLang = (state: RootState) => state.reviewEditor.language;
export const selectModel = (state: RootState) => state.reviewEditor.model;
export const selectCodeSnippet = (state: RootState) => state.reviewEditor.codeSnippet;
export const selectSummary = (state: RootState) => state.reviewEditor.summary;
