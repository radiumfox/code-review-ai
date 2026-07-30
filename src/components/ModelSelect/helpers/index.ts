import { AIModel } from '@/lib/genAI/types';

export function prepareModelName(name: string) {
  return name.replace('models/', '');
}

export function mapModels(models: AIModel[]) {
  return models.map((model) => ({
    value: model.id,
    label: model.name, // or lookup a display name
  }));
}