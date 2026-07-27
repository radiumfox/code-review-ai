import { describe, expect, test } from 'vitest';
import { prepareModelName, mapModels } from './index';

describe('prepareModelName', () => {
  test('Strips models/ prefix', () => {
    expect(prepareModelName('models/gemini-2.5-flash')).toBe('gemini-2.5-flash');
  });

  test('Returns name unchanged when no prefix', () => {
    expect(prepareModelName('gemini-2.5-flash')).toBe('gemini-2.5-flash');
  });

  test('Handles empty string', () => {
    expect(prepareModelName('')).toBe('');
  });
});

describe('mapModels', () => {
  test('Maps models to value/label pairs', () => {
    const models = [
      { name: 'models/gemini-pro', displayName: 'Gemini Pro' },
      { name: 'models/gemini-flash', displayName: 'Gemini Flash' },
    ];

    const result = mapModels(models);

    expect(result).toEqual([
      { value: 'gemini-pro', label: 'Gemini Pro' },
      { value: 'gemini-flash', label: 'Gemini Flash' },
    ]);
  });

  test('Uses name as label when displayName is missing', () => {
    const models = [{ name: 'models/gemini-pro' }];
    const result = mapModels(models);

    expect(result[0].label).toBe('models/gemini-pro');
  });

  test('Uses fallback when both name and displayName are missing', () => {
    const models = [{}];
    const result = mapModels(models);

    expect(result[0]).toEqual({ value: '', label: 'Unknown model' });
  });

  test('Returns empty array for empty input', () => {
    expect(mapModels([])).toEqual([]);
  });
});
