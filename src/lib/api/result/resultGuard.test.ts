import { describe, expect, test } from 'vitest';
import { isApiFailure, isApiResult, isApiSuccess } from './resultGuard';

describe('isApiSuccess', () => {
  test('Returns true for a result with ok: true and data', () => {
    expect(isApiSuccess({ ok: true, data: { id: '1' } })).toBe(true);
  });

  test('Returns true for a result with any data value', () => {
    expect(isApiSuccess({ ok: true, data: null })).toBe(true);
  });

  test('Returns false when ok is not true', () => {
    expect(isApiSuccess({ ok: false, message: 'Failed', code: 'X', statusCode: 500 })).toBe(false);
  });

  test('Returns false when data is missing', () => {
    expect(isApiSuccess({ ok: true })).toBe(false);
  });

  test('Returns false for null and primitives', () => {
    expect(isApiSuccess(null)).toBe(false);
    expect(isApiSuccess('ok')).toBe(false);
  });
});

describe('isApiFailure', () => {
  test('Returns true for a well-formed ApiError', () => {
    expect(isApiFailure({ message: 'Failed', code: 'X', statusCode: 500, ok: false })).toBe(true);
  });

  test('Returns false for a success result and non-objects', () => {
    expect(isApiFailure({ ok: true, data: {} })).toBe(false);
    expect(isApiFailure(undefined)).toBe(false);
    expect(isApiFailure({ message: 'Missing ok', code: 'X', statusCode: 500 })).toBe(false);
  });
});

describe('isApiResult', () => {
  test('Returns true for success and failure results', () => {
    expect(isApiResult({ ok: true, data: [] })).toBe(true);
    expect(isApiResult({ message: 'Failed', code: 'X', statusCode: 500, ok: false })).toBe(true);
  });

  test('Returns false for values that match neither side', () => {
    expect(isApiResult({ data: 'No ok flag' })).toBe(false);
    expect(isApiResult(42)).toBe(false);
    expect(isApiResult(null)).toBe(false);
  });
});