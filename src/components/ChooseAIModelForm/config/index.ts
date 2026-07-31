import { ProviderItem } from "@/components/ChooseAIModelForm/types";

export const PROVIDERS: ProviderItem[] = [
    { id: 'openai', label: 'OpenAI', available: true },
    { id: 'anthropic', label: 'Anthropic', available: false },
    { id: 'google', label: 'Google', available: false },
];