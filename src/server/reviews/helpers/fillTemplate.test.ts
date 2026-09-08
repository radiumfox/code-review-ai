import { describe, expect, test } from 'vitest';
import { fillTemplate } from './fillTemplate';

describe('fillTemplate', () => {
  test('Replaces all variables with values', () => {
    const result = fillTemplate(
      'Hello {{name}}, you are {{age}} years old',
      { name: 'Alice', age: '30' }
    );
    expect(result).toBe('Hello Alice, you are 30 years old');
  });

  test('Leaves missing variables as placeholders', () => {
    const result = fillTemplate('Hello {{name}}', {});
    expect(result).toBe('Hello {{name}}');
  });

  test('Handles empty template', () => {
    expect(fillTemplate('', { key: 'value' })).toBe('');
  });

  test('Handles template with no variables', () => {
    expect(fillTemplate('plain text', { key: 'value' })).toBe('plain text');
  });

  test('Replaces multiple occurrences of the same variable', () => {
    expect(fillTemplate('{{x}} and {{x}}', { x: 'Y' })).toBe('Y and Y');
  });

  test('Ignores non-word-character keys', () => {
    expect(fillTemplate('{{a-b}}', { 'a-b': 'val' })).toBe('{{a-b}}');
  });
});
