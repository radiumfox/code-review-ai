import { AuthenticationError } from 'openai';

export const isInvalidApiKeyError = function (error: unknown): error is AuthenticationError & { code: string } {
  return error instanceof AuthenticationError
        && error.code === 'invalid_api_key';
};