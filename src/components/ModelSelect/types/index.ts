import { AIModel } from '@/lib/genAI/types';

export const MODELS_ACTION_TYPES = {
  append: 'APPEND'
} as const;

export interface ModelsResponse {
    models: AIModel[];
    nextPageToken?: string;
}

export interface ModelSelectProps {
    value: string | null;
    onChange(value: string): void;
    disabled?: boolean;
}

export interface ModelsState {
    models: { value: string; label: string }[];
}

export type ModelsActionType = typeof MODELS_ACTION_TYPES[keyof typeof MODELS_ACTION_TYPES];

export interface ModelsAction {
    type: ModelsActionType;
    payload: ModelsResponse
}