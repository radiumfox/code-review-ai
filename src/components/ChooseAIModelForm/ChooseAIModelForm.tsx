'use client';

import { RadioButton } from '@/components/RadioButton';
import { InputBase } from '@/components/InputBase';
import { ButtonBorder } from '@/components/ButtonBorder';
import { SelectBase } from '@/components/SelectBase';
import {useCallback, useState} from 'react';
import { ButtonBase } from '@/components/ButtonBase';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/config';
import { setModel } from "@/store/reviewEditorStore";
import { useDispatch } from "react-redux";
import { Provider } from "./types";
import { PROVIDERS } from "./config";

const MOCK_MODELS = [
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'o3-mini', label: 'o3 Mini' },
];

export function ChooseAIModelForm() {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const dispatch = useDispatch();

  const handleVerify = async () => {
    if (!apiKey.trim()) return;

    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsVerifying(false);
    setIsVerified(true);
  };

  const selectedProviderMeta = PROVIDERS.find((p) => p.id === selectedProvider);

  const submitModel = useCallback(() => {
    if(!selectedModel) {
      throw new Error('No model selected');
    }

    dispatch(setModel(selectedModel));
    setIsRedirecting(true);
    redirect(ROUTES.main);
  }, [selectedModel, dispatch])

  const changeProvider = useCallback((providerId: Provider) => {
    setSelectedProvider(providerId);
    setIsVerified(false);
    setApiKey('');
    setSelectedModel(null);
  }, []);

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
              onChange={(e) => {
                setApiKey(e.target.value);
                setIsVerified(false);
              }}
              placeholder="sk-..."
              label={'API Key ' + selectedProviderMeta.label}
              type="password"
            />
          </div>

          <ButtonBorder
            onClick={handleVerify}
            disabled={!apiKey.trim() || isVerifying || isVerified}
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
                items={MOCK_MODELS}
                value={selectedModel}
                onChange={setSelectedModel}
                placeholder="Select a model…"
                notFoundText="No models match"
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