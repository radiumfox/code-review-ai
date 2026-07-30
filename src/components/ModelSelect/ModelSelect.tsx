'use client';

import { useCallback, useEffect, useReducer, memo } from 'react';
import { SelectBase } from '@/components/SelectBase';

import { useFetch } from '@/lib/hooks';
import {
  MODELS_ACTION_TYPES,
  ModelsAction,
  ModelSelectProps,
  ModelsResponse,
  ModelsState
} from '@/components/ModelSelect/types';
import { mapModels } from '@/components/ModelSelect/helpers';
import { ROUTES } from '@/lib/config';

function modelsReducer(state: ModelsState, action: ModelsAction): ModelsState {
  switch (action.type) {
  case 'APPEND':
    return {
      models: [
        ...state.models,
        ...mapModels(action.payload.models)
      ]
    };
  }
}

const ModelSelectComponent = function ({
  value,
  onChange,
  disabled
}: ModelSelectProps) {
  const [{ models }, dispatch] = useReducer(modelsReducer, {
    models: []
  });

  const {
    executeFetch,
    data,
    loading
  } = useFetch<Record<string, never>, ModelsResponse>(
    ROUTES.modelsList,
    'GET'
  );

  useEffect(() => {
    executeFetch();
  }, [executeFetch]);

  useEffect(() => {
    if (!data) return;
    console.log(data);
    dispatch({
      type: MODELS_ACTION_TYPES.append,
      payload: data
    });
  }, [data]);

  return (
    <SelectBase
      items={models}
      value={value}
      onChange={onChange}
      placeholder="Search model..."
      notFoundText="No models found"
      disabled={disabled}
    />
  );
};

export const ModelSelect = memo(ModelSelectComponent);
