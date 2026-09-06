import { isApiError } from '../errors';
import type { ApiFailure, ApiResult, ApiSuccess } from './types';

export function isApiSuccess<T = unknown>(result: unknown): result is ApiSuccess<T> {
  return typeof result === 'object'
    && result !== null
    && 'ok' in result
    && result.ok === true
    && 'data' in result;
}

export function isApiFailure(result: unknown): result is ApiFailure {
  return isApiError(result);
}

export function isApiResult<T = unknown>(result: unknown): result is ApiResult<T> {
  return isApiSuccess<T>(result) || isApiFailure(result);
}