import { fillTemplate } from './fillTemplate';
import promptTemplate from '@/prompts/code-review-default.json';
import { ReviewGenerateRequest } from '@/lib/types';

export function buildPrompt(input: ReviewGenerateRequest) {
  const normalizedCode = input.codeSnippet.replace(/\r\n?/g, '\n').replace(/\s+$/g, '');
  const numberedCode = normalizedCode
    .split('\n')
    .map((line, index) => `${index + 1}: ${line}`)
    .join('\n');

  return fillTemplate(promptTemplate.template, {
    language: input.language,
    codeSnippet: numberedCode
  });
}