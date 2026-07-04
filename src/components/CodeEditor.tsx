'use client';

import CodeMirror from '@uiw/react-codemirror';
import {useCallback, useMemo, useState} from 'react';
import { auraInit } from '@uiw/codemirror-theme-aura';
import { langs } from '@uiw/codemirror-extensions-langs';
import SelectBase from '@/components/SelectBase';
import StarIcon from '@/components/icons/StarIcon';

type LanguageExtension = keyof typeof langs;

const EDITOR_BASIC_SETUP = {
  lineNumbers: true,
  foldGutter: true,
  indentOnInput: true,
  autocompletion: true,
};

const THEME_CUSTOM_SETTINGS = {
  settings: {
    caret: '#c6c6c6',
    fontFamily: '\'JetBrains Mono\', \'Fira Code\', \'Consolas\', monospace',
    fontSize: '14px',
  }
};

const allLanguages = Object.keys(langs) as LanguageExtension[];

const DEFAULT_EDITOR_VALUE = 'console.log(\'hello world!\');';
const DEFAULT_LANGUAGE = 'js';

export default function CodeEditor() {
  const [value, setValue] = useState(DEFAULT_EDITOR_VALUE);
  const [lang, setLang] = useState<keyof typeof langs>(DEFAULT_LANGUAGE);

  const onValueChange = useCallback((val: string) => {
    setValue(val);
  }, []);

  const onLanguageChange = useCallback((lang: keyof typeof langs) => {
    setLang(lang);
  }, []);

  const linesCount = useMemo(() => {
    return `${value.split('\n').length} line${value.split('\n').length !== 1 ? 's' : ''}`;
  }, [value]);

  return (
    <div className="mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:w-[50vw] xl:max-w-300 lg:w-full">
      <div className="bg-[#0d0d2b] rounded-xl border border-[#1e1e4a] shadow-2xl shadow-black/50 overflow-hidden">

        {/* Toolbar */}
        <div className={
          `flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 
          px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 
          bg-[#151540] border-b border-[#1e1e4a]`
        }>
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <span className="text-xs sm:text-sm font-medium text-[#6c6cff] tracking-wide uppercase sm:inline flex items-center gap-1.5">
              <StarIcon />
              Code Editor
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">Language:</span>
            <SelectBase
              items={allLanguages}
              value={lang}
              onChange={onLanguageChange}
              placeholder="Search language..."
              notFoundText="No languages found"
            />
          </div>
        </div>

        {/* Editor */}
        <div className="p-0">
          <CodeMirror
            value={value}
            height="300px"
            width="100%"
            extensions={[langs[lang]()]}
            onChange={onValueChange}
            basicSetup={EDITOR_BASIC_SETUP}
            theme={auraInit(THEME_CUSTOM_SETTINGS)}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 py-2 bg-[#151540] border-t border-[#1e1e4a]">
          <span className="text-xs text-gray-500 truncate">
            {lang}
          </span>
          <span className="text-xs text-gray-500">
            {linesCount}
          </span>
        </div>
      </div>
    </div>
  );
}
