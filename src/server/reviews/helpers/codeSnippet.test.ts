import { describe, expect, test } from 'vitest';
import { countCodeLines, normalizeCodeSnippet } from './codeSnippet';

describe('codeSnippet', () => {
  test('Normalizes CRLF and lone CR line endings to LF', () => {
    expect(normalizeCodeSnippet('const a = 1;\r\nconst b = 2;\rconst c = 3;')).toBe(
      'const a = 1;\nconst b = 2;\nconst c = 3;'
    );
  });

  test('Trims trailing whitespace', () => {
    expect(normalizeCodeSnippet('const a = 1;  \n\n')).toBe('const a = 1;');
  });

  test('Counts lines after normalization', () => {
    expect(countCodeLines('const a = 1;\r\nconst b = 2;\n\n')).toBe(2);
  });
});
