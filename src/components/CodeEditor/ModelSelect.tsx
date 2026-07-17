'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { SelectBase } from '@/components/SelectBase';
import { Model } from '@google/genai';
import { useFetch } from '@/lib/hooks';

const MODELS_ACTION_TYPES = {
  append: 'APPEND'
} as const;

interface ModelsResponse {
  models: Model[];
  nextPageToken?: string;
}

interface ModelSelectProps {
  value: string;
  onChange(value: string): void;
}

function prepareModelName(name: string) {
  return name.replace('models/', '');
}

function mapModels(models: Model[]) {
  return models.map((model) => ({
    value: model.name ? prepareModelName(model.name) : '',
    label: model.displayName || model.name || 'Unknown model',
  }));
}

interface ModelsState {
  models: { value: string; label: string }[];
  nextPageToken: string | null;
}

type ModelsActionType = typeof MODELS_ACTION_TYPES[keyof typeof MODELS_ACTION_TYPES];

interface Action {
  type: ModelsActionType;
  payload: ModelsResponse
}

function modelsReducer(state: ModelsState, action: Action): ModelsState {
  switch (action.type) {
  case 'APPEND':
    return {
      models: [
        ...state.models,
        ...mapModels(action.payload.models)
      ],
      nextPageToken: action.payload.nextPageToken ?? null,
    };
  }
}

export function ModelSelect({
  value,
  onChange
}: ModelSelectProps) {
  const valueRef = useRef(value);

  const [{ models, nextPageToken }, dispatch] = useReducer(modelsReducer, {
    models: [],
    nextPageToken: null,
  });

  const {
    executeFetch,
    data,
    loading
  } = useFetch<Record<string, never>, ModelsResponse>(
    '/api/models',
    { method: 'GET' }
  );

  useEffect(() => {
    executeFetch();
  }, []);

  useEffect(() => {
    if (!data) return;

    dispatch({
      type: MODELS_ACTION_TYPES.append,
      payload: data
    });
  }, [data]);

  useEffect(() => {
    if (!data || valueRef.current) return;

    const firstModel = data.models[0];

    if (firstModel) {
      onChange(prepareModelName(firstModel.name ?? ''));
    }
  }, [data, onChange]);

  const loadMore = useCallback(async () => {
    if (!nextPageToken) return;

    await executeFetch(undefined, { pageToken: nextPageToken });
  }, [nextPageToken, executeFetch]);

  return (
    <SelectBase
      items={models}
      value={value}
      onChange={onChange}
      placeholder="Search model..."
      notFoundText="No models found"
      onScrollEnd={loadMore}
      isLoading={loading}
      hasMore={!!nextPageToken}
    />
  );
}
