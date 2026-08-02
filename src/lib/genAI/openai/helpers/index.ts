import { AuthenticationError } from 'openai';

export const isInvalidApiKeyError = function (error: unknown): error is AuthenticationError {
  return error instanceof AuthenticationError
        && error.code === 'invalid_api_key';
};