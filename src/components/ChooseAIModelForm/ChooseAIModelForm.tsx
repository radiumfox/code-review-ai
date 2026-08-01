'use client';

import { RadioButton } from '@/components/RadioButton';
import { InputBase } from '@/components/InputBase';
import { ButtonBorder } from '@/components/ButtonBorder';
import { SelectBase } from '@/components/SelectBase';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { ButtonBase } from '@/components/ButtonBase';
import { redirect } from 'next/navigation';
import { API_ROUTES, ROUTES } from '@/lib/config';
import { setModel } from '@/store/reviewEditorStore';
import { useDispatch } from 'react-redux';
import { Provider } from './types';
import { PROVIDERS } from './config';
import { useFetch } from '@/lib/hooks';
import { FetchModelReturn } from '@/lib/genAI/types';

export function ChooseAIModelForm() {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const dispatch = useDispatch();

  const {
    executeFetch,
    data,
    error: fetchModelsError,
    loading,
    setError: setFetchModelsError
  } = useFetch<object, FetchModelReturn>(API_ROUTES.modelsListOpenai, 'GET');

  const handleVerify = async () => {
    if (!apiKey.trim()) return;

    setIsVerifying(true);

    await executeFetch();
    setIsVerifying(false);
  };

  const isVerified = useMemo(() => {
    return !!data?.models;
  }, [data]);

  const modelsList = useMemo(() => {
    return data?.models.map((model) => {
      return {
        value: model.id,
        label: model.name,
      };
    }) ?? [];
  }, [data]);

  const selectedProviderMeta = PROVIDERS.find((p) => p.id === selectedProvider);

  const submitModel = useCallback(() => {
    if(!selectedModel) {
      throw new Error('No model selected');
    }

    dispatch(setModel(selectedModel));
    setIsRedirecting(true);
    redirect(ROUTES.main);
  }, [selectedModel, dispatch]);

  const changeProvider = useCallback((providerId: Provider) => {
    setSelectedProvider(providerId);
    setApiKey('');
    setSelectedModel(null);
  }, []);

  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    setApiKey(e.target.value);
    setFetchModelsError(null);
  };

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
          <div className="flex flex-col gap-2">
            <InputBase
              id="api-key"
              onChange={handleApiKeyChange}
              placeholder="sk-..."
              label={'API Key ' + selectedProviderMeta.label}
              type="password"
            />
            {fetchModelsError && <span className="text-[#ff5555]">{ fetchModelsError }</span>}
          </div>

          <ButtonBorder
            onClick={handleVerify}
            disabled={!apiKey.trim() || isVerifying || isVerified || !!fetchModelsError}
            theme={isVerified ? 'success' : 'default'}
            loadingText="Verifying…"
            text="Verify Key"
            isLoading={isVerifying}
          />

          {isVerified && (
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
                isLoading={loading}
              />
            </div>
          )}

          {selectedModel &&
            <ButtonBase
              onClick={submitModel}
              text="Start coding"
              isLoading={isRedirecting}
            />
          }
        </div>
      )}
    </>
  );
}