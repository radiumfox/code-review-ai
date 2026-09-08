'use client';

import { useMemo, memo } from 'react';
import { SelectBase } from '@/components/SelectBase';
import {
  LANGUAGES_LIST,
  LANGUAGES_NAMES_MAP,
} from '@/lib/config';
import type { CodingLanguage } from '@/lib/types';

interface LanguageSelectProps {
  value: CodingLanguage | null;
  onChange(value: CodingLanguage): void;
  disabled?: boolean;
}

const LanguageSelectComponent = function ({ value, onChange, disabled }: LanguageSelectProps) {
  const items = useMemo(() => {
    return LANGUAGES_LIST.map((language) => ({
      value: language,
      label: LANGUAGES_NAMES_MAP[language] ?? language,
    }));
  }, []);

  return (
    <SelectBase
      items={items}
      value={value}
      onChange={onChange}
      placeholder="Search language..."
      notFoundText="No languages found"
      disabled={disabled}
    />
  );
};

export const LanguageSelect = memo(LanguageSelectComponent);
