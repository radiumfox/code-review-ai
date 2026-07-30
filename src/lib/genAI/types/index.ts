import OpenAI from 'openai';

export interface AIModel extends OpenAI.Model {
  name: string;
}

export interface FetchModelReturn {
    models: AIModel[];
    nextPageToken: string | null;
}

export type AIChoice = OpenAI.Chat.Completions.ChatCompletion.Choice;