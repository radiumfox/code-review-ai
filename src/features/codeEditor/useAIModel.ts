'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useFetch } from '@/lib/hooks';
import { API_ROUTES } from '@/lib/config';
import { selectModel, setModel } from '@/store/reviewEditorStore';
import { NotificationType, useNotification } from '@/lib/notifications';
import { FetchModelReturn } from '@/lib/genAI/openai/types';

interface UseAIModelReturn {
  model: string | null;
  models: { value: string; label: string }[];
  onModelChange(modelId: string): void;
  fetchingModels: boolean;
  fetchModelsError: string | undefined;
}

export function useAIModel(): UseAIModelReturn {
  const dispatch = useDispatch();
  const model = useSelector(selectModel);
  const { showNotification } = useNotification();
  const { data: session, update: updateSession } = useSession();

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
  } = useFetch<{ model: string }, { model: string }>(API_ROUTES.updateUserModel, 'POST');

  const models = useMemo(() => {
    return modelsData?.models.map((model) => ({
      value: model.id,
      label: model.name,
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

    if (saveModelData) {
      dispatch(setModel(saveModelData.model));

      updateSession({ aiModel: saveModelData.model })
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
    executeSaveModel({ model: modelId });
  }, [executeSaveModel]);

  return {
    model,
    models,
    onModelChange,
    fetchingModels,
    fetchModelsError: fetchModelsError?.message,
  };
}
