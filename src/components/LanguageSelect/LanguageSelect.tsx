'use client';

import { useMemo } from 'react';
import { SelectBase } from '@/components/SelectBase';
import {
  LANGUAGES_LIST,
  LANGUAGES_NAMES_MAP,
} from './config';
import type { CodingLanguage } from '@/lib/types';

interface LanguageSelectProps {
  value: CodingLanguage;
  onChange(value: CodingLanguage): void;
}

export function LanguageSelect({ value, onChange }: LanguageSelectProps) {
  const items = useMemo(() => {
    return LANGUAGES_LIST.map((l) => ({
      value: l,
      label: LANGUAGES_NAMES_MAP[l] ?? l,
    }));
  }, []);

  return (
    <SelectBase
      items={items}
      value={value}
      onChange={onChange}
      placeholder="Search language..."
      notFoundText="No languages found"
    />
  );
}
