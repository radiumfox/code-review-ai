'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useFetch } from '@/lib/hooks';
import { API_ROUTES, MODEL_TO_DESCRIPTION_MAP } from '@/lib/config';
import { selectModel, setModel } from '@/store/reviewEditorStore';
import { NotificationType, useNotification } from '@/lib/providers/notifications';
import { FetchModelReturn } from '@/lib/genAI/openai/types';
import { type User } from '@/lib/types';

interface UseAIModelReturn {
  model: string | null;
  models: { value: string; label: string; description: string }[];
  onModelChange(modelId: string): void;
  fetchingModels: boolean;
  fetchModelsError: string | undefined;
}

const descriptionByModelId: Readonly<Record<string, string | undefined>> = MODEL_TO_DESCRIPTION_MAP;

export function useAIModel(): UseAIModelReturn {
  const dispatch = useDispatch();
  const model = useSelector(selectModel);
  const { showNotification } = useNotification();
  const { data: session, update: updateSession } = useSession();
  const handledSaveDataRef = useRef<User | null>(null);

  const {
    executeFetch: executeFetchModels,
    data: modelsData,
    error: fetchModelsError,
    loading: fetchingModels,
  } = useFetch<object, FetchModelReturn>(API_ROUTES.modelsListOpenai, 'GET');

  const {
    executeFetch: executeSaveModel,
    data: saveModelData,
    error: saveModelError,
  } = useFetch<{ aiModel: string }, User>(API_ROUTES.users, 'PATCH');

  const models = useMemo(() => {
    return modelsData?.models.map((model) => ({
      value: model.id,
      label: model.name,
      description: descriptionByModelId[model.id] ?? '',
    })) ?? [];
  }, [modelsData]);

  useEffect(() => {
    if (!model && session?.user?.aiModel) {
      dispatch(setModel(session.user.aiModel));
    }
  }, [model, session?.user?.aiModel, dispatch]);

  useEffect(() => {
    executeFetchModels();
  }, [executeFetchModels]);

  useEffect(() => {
    if (saveModelError) {
      showNotification({
        type: NotificationType.Error,
        message: saveModelError.message,
      });
    }
  }, [saveModelError, showNotification]);

  useEffect(() => {
    let isActive = true;

    if (saveModelData && handledSaveDataRef.current !== saveModelData) {
      handledSaveDataRef.current = saveModelData;

      if (saveModelData.aiModel) {
        dispatch(setModel(saveModelData.aiModel));
      }

      updateSession({ aiModel: saveModelData.aiModel })
        .catch(() => {
          if (isActive) {
            showNotification({
              type: NotificationType.Error,
              message: 'Failed to update session, please sign in again',
            });
          }
        });
    }

    return () => {
      isActive = false;
    };
  }, [saveModelData, dispatch, updateSession, showNotification]);

  const onModelChange = useCallback((modelId: string) => {
    executeSaveModel({ aiModel: modelId });
  }, [executeSaveModel]);

  return {
    model,
    models,
    onModelChange,
    fetchingModels,
    fetchModelsError: fetchModelsError?.message,
  };
}
