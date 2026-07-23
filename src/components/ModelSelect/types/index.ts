import { Model } from '@google/genai';

export const MODELS_ACTION_TYPES = {
  append: 'APPEND'
} as const;

export interface ModelsResponse {
    models: Model[];
    nextPageToken?: string;
}

export interface ModelSelectProps {
    value: string | null;
    onChange(value: string): void;
    disabled?: boolean;
}

export interface ModelsState {
    models: { value: string; label: string }[];
    nextPageToken: string | null;
}

export type ModelsActionType = typeof MODELS_ACTION_TYPES[keyof typeof MODELS_ACTION_TYPES];

export interface ModelsAction {
    type: ModelsActionType;
    payload: ModelsResponse
}