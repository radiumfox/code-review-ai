import { Model } from '@google/genai';

export interface FetchModelReturn {
    models: Model[];
    nextPageToken: string | null
}