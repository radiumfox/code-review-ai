import type { Extension } from '@codemirror/state';
import { StreamLanguage } from '@codemirror/language';
import { CodingLanguage } from '@/lib/types';

export const languageLoaders: Partial<Record<CodingLanguage, () => Promise<Extension>>> = {
  js:  () => import('@codemirror/lang-javascript').then(m => m.javascript()),
  ts:  () => import('@codemirror/lang-javascript').then(m => m.javascript({ typescript: true })),
  tsx: () => import('@codemirror/lang-javascript').then(m => m.javascript({ jsx: true, typescript: true })),
  jsx: () => import('@codemirror/lang-javascript').then(m => m.javascript({ jsx: true })),
  py:  () => import('@codemirror/lang-python').then(m => m.python()),
  rs:  () => import('@codemirror/lang-rust').then(m => m.rust()),
  go:  () => import('@codemirror/lang-go').then(m => m.go()),
  java: () => import('@codemirror/lang-java').then(m => m.java()),
  cpp: () => import('@codemirror/lang-cpp').then(m => m.cpp()),
  cs:   () => import('@codemirror/legacy-modes/mode/clike').then(m => StreamLanguage.define(m.csharp)),
  rb:   () => import('@codemirror/legacy-modes/mode/ruby').then(m => StreamLanguage.define(m.ruby)),
  php:  () => import('@codemirror/lang-php').then(m => m.php()),
  swift: () => import('@codemirror/legacy-modes/mode/swift').then(m => StreamLanguage.define(m.swift)),
  kt:    () => import('@codemirror/legacy-modes/mode/clike').then(m => StreamLanguage.define(m.kotlin)),
  scala: () => import('@codemirror/legacy-modes/mode/clike').then(m => StreamLanguage.define(m.scala)),
  dart:  () => import('@codemirror/legacy-modes/mode/clike').then(m => StreamLanguage.define(m.dart)),
  html: () => import('@codemirror/lang-html').then(m => m.html()),
  css:  () => import('@codemirror/lang-css').then(m => m.css()),
  scss: () => import('@codemirror/lang-sass').then(m => m.sass()),
  sql:  () => import('@codemirror/lang-sql').then(m => m.sql({ dialect: m.StandardSQL })),
  bash: () => import('@codemirror/legacy-modes/mode/shell').then(m => StreamLanguage.define(m.shell)),
  yaml: () => import('@codemirror/lang-yaml').then(m => m.yaml()),
  json: () => import('@codemirror/lang-json').then(m => m.json()),
  xml:  () => import('@codemirror/lang-xml').then(m => m.xml()),
  markdown: () => import('@codemirror/lang-markdown').then(m => m.markdown()),
  vue:  () => import('@codemirror/lang-vue').then(m => m.vue()),
  svelte: () => import('@replit/codemirror-lang-svelte').then(m => m.svelte()),
};