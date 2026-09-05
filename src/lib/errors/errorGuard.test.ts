import { describe, expect, test } from 'vitest';
import { apiError, isApiError, toApiError } from './errorGuard';
import { ERROR_CODES, FALLBACK_STATUS_CODE, STATUS_CODE_BY_CODE } from './config';

describe('isApiError', () => {
  test('Returns true for a well-formed ApiError', () => {
    const error = { message: 'Too many requests', code: 'TOO_MANY_REQUESTS', statusCode: STATUS_CODE_BY_CODE[ERROR_CODES.TOO_MANY_REQUESTS] };

    expect(isApiError(error)).toBe(true);
  });

  test('Returns false for null and undefined', () => {
    expect(isApiError(null)).toBe(false);
    expect(isApiError(undefined)).toBe(false);
  });

  test('Returns false for non-object values', () => {
    expect(isApiError('error')).toBe(false);
    expect(isApiError(42)).toBe(false);
  });

  test('Returns false for partial shapes', () => {
    expect(isApiError({ message: 'No code' })).toBe(false);
    expect(isApiError({ message: 'No statusCode', code: 'NO_STATUS' })).toBe(false);
    expect(isApiError({ code: 'NO_MESSAGE', statusCode: STATUS_CODE_BY_CODE[ERROR_CODES.VALIDATION] })).toBe(false);
    expect(isApiError({ statusCode: STATUS_CODE_BY_CODE[ERROR_CODES.VALIDATION], message: 'No code' })).toBe(false);
  });
});

describe('toApiError', () => {
  test('Passes through an already well-formed ApiError unchanged', () => {
    const error = { message: 'Rate limited', code: ERROR_CODES.TOO_MANY_REQUESTS, statusCode: STATUS_CODE_BY_CODE[ERROR_CODES.TOO_MANY_REQUESTS] };

    const result = toApiError(error);

    expect(result).toBe(error);
  });

  test('Maps an Error instance to a network error with the fallback status code', () => {
    const result = toApiError(new Error('Failed to fetch'));

    expect(result.message).toBe('Failed to fetch');
    expect(result.code).toBe(ERROR_CODES.NETWORK);
    expect(result.statusCode).toBe(FALLBACK_STATUS_CODE);
  });

  test('Converts the legacy { error } shape, deriving the code from the statusCode', () => {
    const result = toApiError({ error: 'User not found', statusCode: STATUS_CODE_BY_CODE[ERROR_CODES.NOT_FOUND] });

    expect(result.message).toBe('User not found');
    expect(result.code).toBe(ERROR_CODES.NOT_FOUND);
    expect(result.statusCode).toBe(STATUS_CODE_BY_CODE[ERROR_CODES.NOT_FOUND]);
  });

  test('Derives codes for known status codes', () => {
    expect(toApiError({ error: 'Invalid input', statusCode: STATUS_CODE_BY_CODE[ERROR_CODES.VALIDATION] }).code).toBe(ERROR_CODES.VALIDATION);
    expect(toApiError({ error: 'Unauthorized', statusCode: STATUS_CODE_BY_CODE[ERROR_CODES.AUTH] }).code).toBe(ERROR_CODES.AUTH);
    expect(toApiError({ error: 'Forbidden', statusCode: STATUS_CODE_BY_CODE[ERROR_CODES.FORBIDDEN] }).code).toBe(ERROR_CODES.FORBIDDEN);
    expect(toApiError({ error: 'Rate limited', statusCode: STATUS_CODE_BY_CODE[ERROR_CODES.TOO_MANY_REQUESTS] }).code).toBe(ERROR_CODES.TOO_MANY_REQUESTS);
    expect(toApiError({ error: 'Server failed', statusCode: STATUS_CODE_BY_CODE[ERROR_CODES.INTERNAL_SERVER] }).code).toBe(ERROR_CODES.INTERNAL_SERVER);
    expect(toApiError({ error: 'AI generation failed', statusCode: STATUS_CODE_BY_CODE[ERROR_CODES.AI] }).code).toBe(ERROR_CODES.AI);
  });

  test('Uses the UNKNOWN code for status codes without a mapping', () => {
    const result = toApiError({ error: 'Weird status', statusCode: 451 });

    expect(result.code).toBe(ERROR_CODES.UNKNOWN);
    expect(result.statusCode).toBe(451);
  });

  test('Reads statusCode from the Response-like { status } field', () => {
    const result = toApiError({ error: 'Bad request', status: STATUS_CODE_BY_CODE[ERROR_CODES.VALIDATION] });

    expect(result.message).toBe('Bad request');
    expect(result.code).toBe(ERROR_CODES.VALIDATION);
    expect(result.statusCode).toBe(STATUS_CODE_BY_CODE[ERROR_CODES.VALIDATION]);
  });

  test('Fills in a derived code when only message and statusCode are given', () => {
    const result = toApiError({ message: 'Too many requests', statusCode: STATUS_CODE_BY_CODE[ERROR_CODES.TOO_MANY_REQUESTS] });

    expect(result.code).toBe(ERROR_CODES.TOO_MANY_REQUESTS);
  });

  test('Preserves a custom code when present', () => {
    const result = toApiError({ message: 'Custom issue', code: 'CUSTOM_CODE', statusCode: 418 });

    expect(result.message).toBe('Custom issue');
    expect(result.code).toBe('CUSTOM_CODE');
    expect(result.statusCode).toBe(418);
  });

  test('Falls back to a default error for null', () => {
    const result = toApiError(null);

    expect(result.message).toBe('Something went wrong');
    expect(result.code).toBe(ERROR_CODES.UNKNOWN);
    expect(result.statusCode).toBe(FALLBACK_STATUS_CODE);
  });

  test('Falls back to a default error for undefined', () => {
    const result = toApiError(undefined);

    expect(result.message).toBe('Something went wrong');
    expect(result.code).toBe(ERROR_CODES.UNKNOWN);
    expect(result.statusCode).toBe(FALLBACK_STATUS_CODE);
  });

  test('Falls back to a default error for primitives', () => {
    const result = toApiError('some string');

    expect(result.message).toBe('Something went wrong');
    expect(result.code).toBe(ERROR_CODES.UNKNOWN);
    expect(result.statusCode).toBe(FALLBACK_STATUS_CODE);
  });

  test('Falls back to a default error for arrays without error fields', () => {
    const result = toApiError(['unrelated', 'data']);

    expect(result.message).toBe('Something went wrong');
    expect(result.code).toBe(ERROR_CODES.UNKNOWN);
    expect(result.statusCode).toBe(FALLBACK_STATUS_CODE);
  });

  test('Falls back when message is present but not a string', () => {
    const result = toApiError({ message: 42, statusCode: STATUS_CODE_BY_CODE[ERROR_CODES.INTERNAL_SERVER] });

    expect(result.message).toBe('Something went wrong');
    expect(result.code).toBe(ERROR_CODES.INTERNAL_SERVER);
    expect(result.statusCode).toBe(STATUS_CODE_BY_CODE[ERROR_CODES.INTERNAL_SERVER]);
  });
});

describe('apiError', () => {
  test('Creates an Error that satisfies isApiError', () => {
    const error = apiError('AI failed', ERROR_CODES.AI, STATUS_CODE_BY_CODE[ERROR_CODES.AI]);

    expect(error).toBeInstanceOf(Error);
    expect(isApiError(error)).toBe(true);
    expect(error.message).toBe('AI failed');
    expect(error.code).toBe(ERROR_CODES.AI);
    expect(error.statusCode).toBe(STATUS_CODE_BY_CODE[ERROR_CODES.AI]);
  });
});
