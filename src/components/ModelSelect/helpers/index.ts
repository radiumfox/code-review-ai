import { Model } from '@google/genai';

export function prepareModelName(name: string) {
  return name.replace('models/', '');
}

export function mapModels(models: Model[]) {
  return models.map((model) => ({
    value: model.name ? prepareModelName(model.name) : '',
    label: model.displayName || model.name || 'Unknown model',
  }));
}