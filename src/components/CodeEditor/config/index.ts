import { langs } from '@uiw/codemirror-extensions-langs';

export type LanguageExtension = keyof typeof langs;

export const LANGUAGES_LIST: LanguageExtension[] = [
  'js', 'ts', 'tsx', 'jsx', 'py', 'rs', 'go',
  'java', 'cpp', 'cs', 'rb', 'php', 'swift',
  'kt', 'scala', 'dart', 'html', 'css',
  'scss', 'sql', 'bash', 'yaml', 'json', 'xml',
  'markdown', 'vue', 'svelte',
];

export const LANGUAGES_NAMES_MAP: Partial<Record<LanguageExtension, string>> = {
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

export const EDITOR_BASIC_SETUP = {
  lineNumbers: true,
  foldGutter: true,
  indentOnInput: true,
  autocompletion: true,
};

export const THEME_CUSTOM_SETTINGS = {
  settings: {
    caret: '#c6c6c6',
    fontFamily: '\'JetBrains Mono\', \'Fira Code\', \'Consolas\', monospace',
    fontSize: '14px',
  }
};

export const DEFAULT_EDITOR_VALUE = 'console.log(\'hello world!\');';
export const DEFAULT_LANGUAGE: LanguageExtension = 'js';
