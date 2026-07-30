import { describe, expect, test } from 'vitest';
import { prepareModelName, mapModels } from './index';
import { AIModel } from '@/lib/genAI/types';

describe('prepareModelName', () => {
  test('Strips models/ prefix', () => {
    expect(prepareModelName('models/gpt-4')).toBe('gpt-4');
  });

  test('Returns name unchanged when no prefix', () => {
    expect(prepareModelName('gpt-4')).toBe('gpt-4');
  });

  test('Handles empty string', () => {
    expect(prepareModelName('')).toBe('');
  });
});

describe('mapModels', () => {
  test('Maps models to value/label pairs using id', () => {
    const models: AIModel[] = [
      { id: 'llama-3.3-70b-versatile', object: 'model', created: 1, owned_by: 'groq', name: 'Llama 3.1 8B' },
      { id: 'qwen/qwen3.6-27b', object: 'model', created: 2, owned_by: 'Alibaba Cloud', name: 'Qwen/Qwen3.6-27B' },
    ];

    const result = mapModels(models);

    expect(result).toEqual([
      { value: 'Llama 3.1 8B', label: 'llama-3.3-70b-versatile' },
      { value: 'mixtral-8x7b-32768', label: 'mixtral-8x7b-32768' },
    ]);
  });

  test('Returns empty array for empty input', () => {
    expect(mapModels([])).toEqual([]);
  });
});
