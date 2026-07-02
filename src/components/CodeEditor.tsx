'use client';

import CodeMirror from '@uiw/react-codemirror';
import { useCallback, useState } from 'react';
import { auraInit } from '@uiw/codemirror-theme-aura';
import { langs } from '@uiw/codemirror-extensions-langs';
import LanguageSelect from '@/components/LanguageSelect';


export default function CodeEditor() {
  const [value, setValue] = useState('console.log(\'hello world!\');');
  const [lang, setLang] = useState<keyof typeof langs>('js');

  const onValueChange = useCallback((value: string) => {
    setValue(value);
  }, []);

  const onLanguageChange = useCallback((value: keyof typeof langs) => {
    setLang(value);
  }, []);

  return (
    <div>
      <LanguageSelect
        value={lang}
        onChange={onLanguageChange}
      />
      <CodeMirror
        value={value}
        height="500px"
        width="1000px"
        extensions={[langs[lang]()]}
        onChange={onValueChange}
        theme={auraInit({
          settings: {
            caret: '#c6c6c6',
            fontFamily: 'monospace',
          },
        })}

      />
    </div>);
}