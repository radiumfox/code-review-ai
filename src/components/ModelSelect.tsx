'use client';

import { useState, useCallback } from 'react';
import { SelectBase } from '@/components/SelectBase';
import type { ModelItem } from '@/lib/gen-ai';

interface ModelSelectProps {
  initialModels: ModelItem[];
  initialNextPageToken: string | null;
  value: string;
  onChange(value: string): void;
}

export default function ModelSelect({
    initialModels,
    initialNextPageToken,
    value,
    onChange
  }: ModelSelectProps) {
  const [models, setModels] = useState(initialModels);
  const [nextPageToken, setNextPageToken] = useState(initialNextPageToken);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (isLoading || !nextPageToken) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/models?pageToken=${encodeURIComponent(nextPageToken)}`);
      const data = await response.json();

      setModels(prev => [...prev, ...data.models]);
      setNextPageToken(data.nextPageToken);
    } catch (error) {
      console.error('Failed to load models', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, nextPageToken]);

  const items = models.map(model => ({
    value: model.name,
    label: model.displayName || model.name,
  }));

  return (
    <SelectBase
      items={items}
      value={value}
      onChange={onChange}
      placeholder="Search model..."
      notFoundText="No models found"
      onScrollEnd={loadMore}
      isLoading={isLoading}
      hasMore={!!nextPageToken}
    />
  );
}
