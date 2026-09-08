import type { ApiError } from '../errors';

export interface ApiSuccess<T = unknown> {
  ok: true;
  data: T;
}

export type ApiFailure = ApiError;

export type ApiResult<T = unknown> = ApiSuccess<T> | ApiFailure;