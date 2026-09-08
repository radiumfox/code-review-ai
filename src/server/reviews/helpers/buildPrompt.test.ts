import { describe, expect, test } from 'vitest';
import { buildPrompt } from './buildPrompt';
import promptTemplate from '@/prompts/code-review-default.json';
import type { ReviewGenerateRequest } from '@/lib/types';

const codeSnippet = 'const a = 1;\nconst b = 2;';

function createRequest(overrides: Partial<ReviewGenerateRequest> = {}): ReviewGenerateRequest {
  return {
    language: 'js',
    codeSnippet,
    model: 'llama-3.3-70b-versatile',
    ...overrides,
  };
}

describe('buildPrompt', () => {
  test('Numbers each line starting at 1', () => {
    const prompt = buildPrompt(createRequest());

    expect(prompt).toContain('1: const a = 1;\n2: const b = 2;');
  });

  test('Normalizes CRLF line endings to LF before numbering', () => {
    const prompt = buildPrompt(createRequest({ codeSnippet: 'const a = 1;\r\nconst b = 2;' }));

    expect(prompt).toContain('1: const a = 1;\n2: const b = 2;');
    expect(prompt).not.toContain('\r');
  });

  test('Normalizes lone CR line endings to LF before numbering', () => {
    const prompt = buildPrompt(createRequest({ codeSnippet: 'const a = 1;\rconst b = 2;' }));

    expect(prompt).toContain('1: const a = 1;\n2: const b = 2;');
  });

  test('Trims trailing whitespace so no phantom last line is numbered', () => {
    const prompt = buildPrompt(createRequest({ codeSnippet: 'const a = 1;\n' }));

    expect(prompt).toContain('1: const a = 1;');
    expect(prompt).not.toContain('2:');
  });

  test('Injects the language into the template', () => {
    const prompt = buildPrompt(createRequest({ language: 'py' }));

    expect(prompt).toContain('Analyze the following py code snippet');
  });

  test('Builds the full template with the numbered code embedded', () => {
    const prompt = buildPrompt(createRequest());
    const [templateBefore, templateAfter] = promptTemplate.template.split('{{codeSnippet}}');

    expect(prompt).toBe(
      `${templateBefore.replaceAll('{{language}}', 'js')}1: const a = 1;\n2: const b = 2;${templateAfter}`
    );
  });
});