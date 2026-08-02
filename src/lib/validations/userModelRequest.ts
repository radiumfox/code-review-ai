import { z } from 'zod';
import {
  MODEL_MAX_VALUE,
  MODEL_MIN_VALUE
} from '@/lib/validations/config';

export const userModelRequest = z.object({
  model: z.string().min(MODEL_MIN_VALUE).max(MODEL_MAX_VALUE),
});
