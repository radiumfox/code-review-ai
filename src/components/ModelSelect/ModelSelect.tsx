'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { SelectBase } from '@/components/SelectBase';

import { useFetch } from '@/lib/hooks';
import {
  MODELS_ACTION_TYPES,
  ModelsAction,
  ModelSelectProps,
  ModelsResponse,
  ModelsState
} from '@/components/ModelSelect/types';
import { mapModels, prepareModelName } from '@/components/ModelSelect/helpers';

function modelsReducer(state: ModelsState, action: ModelsAction): ModelsState {
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
    'GET'
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
    if (!data || value) return;

    const firstModel = data.models[0];

    if (firstModel) {
      onChange(prepareModelName(firstModel.name ?? ''));
    }
  }, [data, onChange, value]);

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
