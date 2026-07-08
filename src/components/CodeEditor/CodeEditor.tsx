'use client';

import CodeMirror from '@uiw/react-codemirror';
import { useCallback, useMemo, useState } from 'react';
import { auraInit } from '@uiw/codemirror-theme-aura';
import { langs } from '@uiw/codemirror-extensions-langs';
import { ModelSelect } from '@/components/CodeEditor/ModelSelect';
import { LanguageSelect } from '@/components/CodeEditor/LanguageSelect';
import StarIcon from '@/components/icons/StarIcon';
import {
  DEFAULT_EDITOR_VALUE,
  DEFAULT_LANGUAGE,
  LANGUAGES_NAMES_MAP,
  EDITOR_BASIC_SETUP,
  THEME_CUSTOM_SETTINGS
} from '@/components/CodeEditor/config';

export function CodeEditor() {
  const [value, setValue] = useState(DEFAULT_EDITOR_VALUE);
  const [lang, setLang] = useState<keyof typeof langs>(DEFAULT_LANGUAGE);
  const [model, setModel] = useState('');

  const onValueChange = useCallback((val: string) => {
    setValue(val);
  }, []);

  const linesCount = useMemo(() => {
    const valueLength = value.split('\n').length;
    return `${valueLength} line${valueLength !== 1 ? 's' : ''}`;
  }, [value]);

  const extensions = useMemo(() => {
    return [langs[lang]()];
  }, [lang]);

  const theme = useMemo(() => {
    return auraInit(THEME_CUSTOM_SETTINGS);
  }, []);

  return (
    <div className="mx-auto w-full px-3 sm:px-6 md:max-w-4xl lg:max-w-6xl xl:max-w-7xl transition-all duration-300">
      <div className="bg-[#0d0d2b] rounded-xl border border-[#1e1e4a] shadow-2xl shadow-black/50 overflow-hidden">

        {/* Toolbar */}
        <div className={
          `flex flex-col md:flex-row items-stretch md:items-center gap-2 sm:gap-3 
          px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 transition-all duration-300
          bg-[#151540] border-b border-[#1e1e4a]`
        }>
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <div className="flex items-center gap-2">
              <StarIcon className="text-[#6c6cff] w-5 h-5" />
              <span className="uppercase text-xs sm:text-sm transition-all duration-300 font-medium text-[#6c6cff]">Code Editor</span>
            </div>
          </div>

          {/* Model select */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">Model:</span>
            <ModelSelect
              value={model}
              onChange={setModel}
            />
          </div>

          {/* Language select */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">Language:</span>
            <LanguageSelect
              value={lang}
              onChange={setLang}
            />
          </div>
        </div>

        {/* Editor */}
        <div className="p-0">
          <CodeMirror
            value={value}
            height="300px"
            width="100%"
            extensions={extensions}
            onChange={onValueChange}
            basicSetup={EDITOR_BASIC_SETUP}
            theme={theme}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 py-2 transition-all duration-300 bg-[#151540] border-t border-[#1e1e4a]">
          <span className="text-xs text-gray-500 truncate">
            {LANGUAGES_NAMES_MAP[lang] ?? lang}
          </span>
          <span className="text-xs text-gray-500">
            {linesCount}
          </span>
        </div>
      </div>
    </div>
  );
}
