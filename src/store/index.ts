import { configureStore } from '@reduxjs/toolkit';
import { reviewsListSlice } from './reviewsListStore';
import { reviewEditorSlice } from './reviewEditorStore';

export const store = configureStore({
  reducer: {
    reviewsList: reviewsListSlice.reducer,
    reviewEditor: reviewEditorSlice.reducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
