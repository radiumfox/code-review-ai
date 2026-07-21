import type { CodingLanguage } from '@/lib/types';

export const REVIEWS_LIST_LIMIT = 20;

export const LANGUAGES_LIST: CodingLanguage[] = [
  'js', 'ts', 'tsx', 'jsx', 'py', 'rs', 'go',
  'java', 'cpp', 'cs', 'rb', 'php', 'swift',
  'kt', 'scala', 'dart', 'html', 'css',
  'scss', 'sql', 'bash', 'yaml', 'json', 'xml',
  'markdown', 'vue', 'svelte',
];

export const LANGUAGES_NAMES_MAP: Partial<Record<CodingLanguage, string>> = {
  js: 'JavaScript',
  ts: 'TypeScript',
  tsx: 'TSX',
  jsx: 'JSX',
  py: 'Python',
  rs: 'Rust',
  go: 'Go',
  java: 'Java',
  cpp: 'C++',
  cs: 'C#',
  rb: 'Ruby',
  php: 'PHP',
  swift: 'Swift',
  kt: 'Kotlin',
  scala: 'Scala',
  dart: 'Dart',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  sql: 'SQL',
  bash: 'Bash',
  yaml: 'YAML',
  json: 'JSON',
  xml: 'XML',
  markdown: 'Markdown',
  vue: 'Vue',
  svelte: 'Svelte',
};

export const DEFAULT_LANGUAGE: CodingLanguage = 'js';