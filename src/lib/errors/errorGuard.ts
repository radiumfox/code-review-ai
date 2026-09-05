import type { ApiError } from '@/lib/errors/types';
import { ERROR_CODES, CODE_BY_STATUS_CODE, FALLBACK_STATUS_CODE, FALLBACK_MESSAGE } from '@/lib/errors/config';

function codeFromStatus(statusCode: number): string {
  return CODE_BY_STATUS_CODE[statusCode] ?? ERROR_CODES.UNKNOWN;
}

export function apiError(message: string, code: string, statusCode: number): Error & ApiError {
  return Object.assign(new Error(message), { code, statusCode });
}

export function isApiError(error: unknown): error is ApiError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  return 'message' in error
    && typeof error.message === 'string'
    && 'code' in error
    && typeof error.code === 'string'
    && 'statusCode' in error
    && typeof error.statusCode === 'number';
}

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: ERROR_CODES.NETWORK,
      statusCode: FALLBACK_STATUS_CODE,
    };
  }

  if (typeof error === 'object' && error !== null) {
    const isErrorLike = 'message' in error
      || 'error' in error
      || 'code' in error
      || 'statusCode' in error
      || 'status' in error;

    if (isErrorLike) {
      const message = 'message' in error && typeof error.message === 'string'
        ? error.message
        : 'error' in error && typeof error.error === 'string'
          ? error.error
          : FALLBACK_MESSAGE;

      const statusCode = 'statusCode' in error
        ? typeof error.statusCode === 'number'
          ? error.statusCode
          : FALLBACK_STATUS_CODE
        : 'status' in error && typeof error.status === 'number'
          ? error.status
          : FALLBACK_STATUS_CODE;

      const code = 'code' in error && typeof error.code === 'string'
        ? error.code
        : codeFromStatus(statusCode);

      return { message, code, statusCode };
    }
  }

  return {
    message: FALLBACK_MESSAGE,
    code: ERROR_CODES.UNKNOWN,
    statusCode: FALLBACK_STATUS_CODE,
  };
}