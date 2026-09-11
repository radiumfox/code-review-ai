export const FREE_AI_MODELS = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
] as const;

export const DEFAULT_AI_MODEL = 'openai/gpt-oss-20b';

export const MODEL_TO_DESCRIPTION_MAP: Record<(typeof FREE_AI_MODELS)[number], string> = {
  'openai/gpt-oss-120b': 'Deep Review',
  'openai/gpt-oss-20b': 'Fast Review',
};