import { fillTemplate } from './fillTemplate';
import promptTemplate from '@/prompts/code-review-default.json';
import { ReviewGenerateRequest } from '@/lib/types';
import { sanitizeCodeSnippet } from '@/lib/validations/helpers/sanitizeCodeSnippet';

export function buildPrompt(input: ReviewGenerateRequest) {
  const normalizedCode = sanitizeCodeSnippet(input.codeSnippet);
  const numberedCode = normalizedCode
    .split('\n')
    .map((line, index) => `${index + 1}: ${line}`)
    .join('\n');

  return fillTemplate(promptTemplate.template, {
    language: input.language,
    codeSnippet: numberedCode
  });
}