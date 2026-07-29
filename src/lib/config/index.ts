import promptTemplate from '@/prompts/code-review-default.json';

export const REVIEWS_LIST_LIMIT = 20;

export const DEFAULT_MODEL = promptTemplate.model;
export const DEFAULT_MODEL_NAME = promptTemplate.modelName;

export const DEFAULT_EDITOR_VALUE = 'console.log(\'hello world!\');';

export * from './languages';
export * from './routes';