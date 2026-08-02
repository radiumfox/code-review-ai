import { describe, expect, test } from 'vitest';
import { userModelRequest } from './userModelRequest';
import { MODEL_MAX_VALUE } from '@/lib/validations/config';

describe('userModelRequest', () => {
  test('Successfully parse valid data', () => {
    const data = { model: 'llama-3.3-70b-versatile' };
    const validation = userModelRequest.safeParse(data);

    expect(validation.success).toBe(true);
    expect(validation.data).toEqual(data);
  });

  test('Parse with error if model is missing', () => {
    const validation = userModelRequest.safeParse({});

    expect(validation.success).toBe(false);
  });

  test('Parse with error if model length doesn\'t satisfy constraints', () => {
    const validation1 = userModelRequest.safeParse({ model: '' });
    const validation2 = userModelRequest.safeParse({ model: 'x'.repeat(MODEL_MAX_VALUE + 1) });

    expect(validation1.success).toBe(false);
    expect(validation2.success).toBe(false);
  });
});
