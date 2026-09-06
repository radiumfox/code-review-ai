'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Extension } from '@codemirror/state';
import { LANGUAGES_NAMES_MAP } from '@/lib/config';
import type { AppDispatch } from '@/store';
import type { CodingLanguage } from '@/lib/types';
import { selectLang, setLanguage } from '@/store/reviewEditorStore';
import { languageLoaders } from './plugins/languageLoaders';

export function useLanguage() {
  const language = useSelector(selectLang);
  const dispatch = useDispatch<AppDispatch>();
  const [languageExtension, setLanguageExtension] = useState<Extension | null>(null);

  useEffect(() => {
    let cancelled = false;

    if(!language) {
      Promise.resolve().then(() => {
        if (!cancelled) setLanguageExtension(null);
      });
      return () => {
        cancelled = true;
      };
    }

    languageLoaders[language]?.().then((ext) => {
      if (!cancelled) setLanguageExtension(ext);
    }).catch(() => {
      if (!cancelled) setLanguageExtension(null);
    });

    return () => {
      cancelled = true;
    };
  }, [language]);

  const onLanguageChange = useCallback((value: CodingLanguage) => {
    dispatch(setLanguage(value));
  }, [dispatch]);

  const languageName = useMemo(() => {
    if(language && LANGUAGES_NAMES_MAP[language]) return LANGUAGES_NAMES_MAP[language];

    return language ?? 'Unknown language';
  }, [language]);

  return {
    language,
    languageName,
    languageExtension,
    onLanguageChange,
  };
}