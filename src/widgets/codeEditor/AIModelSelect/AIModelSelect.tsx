'use client';

import { memo } from 'react';
import { SelectBase } from '@/components/SelectBase';
import type { AIModelSelectProps } from './types';

const AIModelSelectComponent = function ({ value, onChange, disabled, models, isLoading, error }: AIModelSelectProps) {
  return (
    <SelectBase<string>
      items={models}
      value={value}
      onChange={onChange}
      placeholder="Search model..."
      notFoundText="No models found"
      disabled={disabled}
      isLoading={isLoading}
      error={error}
      className="min-w-60"
    />
  );
};

export const AIModelSelect = memo(AIModelSelectComponent);