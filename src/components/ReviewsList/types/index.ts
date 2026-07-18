import { Review } from '@/lib/createReviewService/types';

export const REVIEWS_ACTION_TYPES = {
  append: 'APPEND'
} as const;

export interface ReviewsResponse {
  reviews: Review[];
  nextPage?: number;
}

export interface ReviewsListState {
  reviews: Review[];
  nextPage: number;
  hasMore: boolean;
}

export type ReviewsListActionType = typeof REVIEWS_ACTION_TYPES[keyof typeof REVIEWS_ACTION_TYPES];

export interface ReviewsListAction {
  type: ReviewsListActionType;
  payload: ReviewsResponse;
}
