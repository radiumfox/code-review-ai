'use client';

import { useState, useCallback, useEffect } from 'react';
import { SelectBase } from '@/components/SelectBase';
import { Model } from "@google/genai";

interface ModelSelectProps {
  value: string;
  onChange(value: string): void;
}

export function ModelSelect({
  value,
  onChange
}: ModelSelectProps) {
  const [models, setModels] = useState<{ value: string; label: string }[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/models')
      .then(response => response.json())
      .then(data => {
        const items = data.models.map((model: Model) => ({
          value: model.name,
          label: model.displayName || model.name,
        }));

        setModels(items);
        setNextPageToken(data.nextPageToken);

        if (!value && items.length > 0) {
          onChange(items[0].value);
        }
      })
      .catch(error => console.error('Failed to load models', error));
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoading || !nextPageToken) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/models?pageToken=${encodeURIComponent(nextPageToken)}`);
      const data = await response.json();

      const items = data.models.map((model: Model) => ({
        value: model.name,
        label: model.displayName || model.name,
      }));

      setModels(prev => [...prev, ...items]);
      setNextPageToken(data.nextPageToken);
    } catch (error) {
      console.error('Failed to load models', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, nextPageToken]);

  return (
    <SelectBase
      items={models}
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
