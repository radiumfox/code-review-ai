export type Provider = 'openai' | 'anthropic' | 'google';

export interface ProviderItem {
    id: Provider;
    label: string;
    available: boolean
}
