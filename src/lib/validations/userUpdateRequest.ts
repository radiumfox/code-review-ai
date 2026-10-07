import { z } from 'zod';
import {
  EMAIL_MAX_VALUE,
  EMAIL_MIN_VALUE,
  MODEL_MAX_VALUE,
  MODEL_MIN_VALUE,
  NAME_MAX_VALUE,
  NAME_MIN_VALUE,
  PROVIDER_ID_MAX_VALUE,
  PROVIDER_ID_MIN_VALUE
} from '@/lib/validations/config';
import { AuthProvider } from '@/lib/types';

export const userUpdateRequest = z.object({
  name: z.string().min(NAME_MIN_VALUE).max(NAME_MAX_VALUE),
  email: z.string().min(EMAIL_MIN_VALUE).max(EMAIL_MAX_VALUE).email(),
  aiModel: z.string().min(MODEL_MIN_VALUE).max(MODEL_MAX_VALUE).nullable(),
  provider: z.enum(AuthProvider),
  githubId: z.string().trim().min(PROVIDER_ID_MIN_VALUE).max(PROVIDER_ID_MAX_VALUE),
  githubUsername: z.string().trim().min(PROVIDER_ID_MIN_VALUE).max(PROVIDER_ID_MAX_VALUE),
  googleId: z.string().trim().min(PROVIDER_ID_MIN_VALUE).max(PROVIDER_ID_MAX_VALUE),
}).partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one updatable field is required',
  });