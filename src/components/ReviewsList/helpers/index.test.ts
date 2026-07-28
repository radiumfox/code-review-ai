import { describe, expect, test } from 'vitest';
import { formatDate, formatTime } from './index';

describe('formatDate', () => {
  test('Formats valid ISO date string', () => {
    const result = formatDate('2025-06-15T10:30:00.000Z');
    expect(result).toBeTruthy();
    expect(result).toMatch(/\w+ \d+, \d{4}/);
  });

  test('Returns empty string for invalid date', () => {
    expect(formatDate('not-a-date')).toBe('');
  });

  test('Returns empty string for empty string', () => {
    expect(formatDate('')).toBe('');
  });
});

describe('formatTime', () => {
  test('Formats valid ISO date string', () => {
    const result = formatTime('2025-06-15T10:30:00.000Z');
    expect(result).toBeTruthy();
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  test('Returns empty string for invalid date', () => {
    expect(formatTime('not-a-date')).toBe('');
  });

  test('Returns empty string for empty string', () => {
    expect(formatTime('')).toBe('');
  });
});
