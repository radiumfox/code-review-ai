'use client';

import { RadioButton } from '@/components/RadioButton';
import { ButtonBorder } from '@/components/ButtonBorder';
import { SelectBase } from '@/components/SelectBase';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ROUTES, ROUTES } from '@/lib/config';
import { setModel } from '@/store/reviewEditorStore';
import { useDispatch } from 'react-redux';
import { Provider } from './types';
import { PROVIDERS } from './config';
import { useFetch } from '@/lib/hooks';
import { FetchModelReturn } from '@/lib/genAI/types';
import { NotificationType, useNotification } from '@/lib/notifications';

export function ChooseAIModelForm() {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { showNotification } = useNotification();
  const router = useRouter();

  const {
    executeFetch: executeFetchModels,
    data: modelsData,
    error: fetchModelsError,
    loading: fetchModelsLoading,
  } = useFetch<object, FetchModelReturn>(API_ROUTES.modelsListOpenai, 'GET');

  const {
    executeFetch: executeSaveModel,
    data: saveModelData,
    error: saveModelError,
    loading: saveModelLoading
  } = useFetch<{ model: string }, { data: { model: string } }>(API_ROUTES.updateUserModel, 'POST');

  const modelsList = useMemo(() => {
    return modelsData?.models.map((model) => {
      return {
        value: model.id,
        label: model.name,
      };
    }) ?? [];
  }, [modelsData]);

  const selectedProviderMeta = PROVIDERS.find((p) => p.id === selectedProvider);

  const submitModel = useCallback(() => {
    if(!selectedModel) {
      return;
    }

    executeSaveModel({ model: selectedModel });
  }, [selectedModel, executeSaveModel]);

  useEffect(() => {
    if(saveModelError) {
      showNotification({
        type: NotificationType.Error,
        message: saveModelError,
      });
    }
  }, [saveModelError, showNotification]);

  useEffect(() => {
    if(saveModelData) {
      dispatch(setModel(saveModelData.data.model));
      router.replace(ROUTES.main);
    }
  }, [saveModelData, dispatch, router]);

  const changeProvider = useCallback(async (providerId: Provider) => {
    setSelectedProvider(providerId);
    setSelectedModel(null);
    await executeFetchModels();
  }, [executeFetchModels]);

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {PROVIDERS.map((provider) => {
          const isActive = selectedProvider === provider.id;

          return (
            <RadioButton
              key={provider.id}
              id={provider.id}
              label={provider.label}
              helpText={!provider.available ? 'Coming soon' : ''}
              isActive={isActive}
              onChange={() => changeProvider(provider.id)}
              disabled={!provider.available}
            />
          );
        })}
      </div>

      {selectedProviderMeta && (
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2 pt-2">
            <span className="text-xs uppercase tracking-widest text-[#8d8d92]">
              Available Models
            </span>
            <SelectBase
              items={modelsList}
              value={selectedModel}
              onChange={setSelectedModel}
              placeholder="Select a model…"
              notFoundText="No models match"
              isLoading={fetchModelsLoading}
              error={fetchModelsError ?? undefined}
            />
          </div>

          {selectedModel &&
            <ButtonBorder
              onClick={submitModel}
              text="Start coding"
              isLoading={saveModelLoading}
            />
          }
        </div>
      )}
    </>
  );
}