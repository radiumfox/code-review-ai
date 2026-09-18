import { describe, expect, test } from 'vitest';
import { userUpdateRequest } from './userUpdateRequest';
import {
  EMAIL_MAX_VALUE,
  EMAIL_MIN_VALUE,
  NAME_MAX_VALUE,
  PROVIDER_ID_MAX_VALUE
} from '@/lib/validations/config';
import { AuthProvider } from '@/lib/types';

describe('userUpdateRequest', () => {
  test('Successfully parse a single valid field', () => {
    const data = { aiModel: 'llama-3.3-70b-versatile' };
    const validation = userUpdateRequest.safeParse(data);

    expect(validation.success).toBe(true);
    expect(validation.data).toEqual(data);
  });

  test('Successfully parse multiple valid fields', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      provider: AuthProvider.Github,
      githubUsername: 'johndoe',
    };
    const validation = userUpdateRequest.safeParse(data);

    expect(validation.success).toBe(true);
    expect(validation.data).toEqual(data);
  });

  test('Parse with error if no field is provided', () => {
    const validation = userUpdateRequest.safeParse({});

    expect(validation.success).toBe(false);
  });

  test('Parse with error if role is provided', () => {
    const validation = userUpdateRequest.safeParse({ role: 'admin' });

    expect(validation.success).toBe(false);
  });

  test('Parse with error if name length doesn\'t satisfy constraints', () => {
    const validation1 = userUpdateRequest.safeParse({ name: '' });
    const validation2 = userUpdateRequest.safeParse({ name: 'x'.repeat(NAME_MAX_VALUE + 1) });

    expect(validation1.success).toBe(false);
    expect(validation2.success).toBe(false);
  });

  test('Parse with error if email is invalid', () => {
    const validation1 = userUpdateRequest.safeParse({ email: 'not-an-email' });
    const validation2 = userUpdateRequest.safeParse({ email: 'a'.repeat(EMAIL_MIN_VALUE - 1) });
    const validation3 = userUpdateRequest.safeParse({
      email: `${'a'.repeat(EMAIL_MAX_VALUE)}@example.com`
    });

    expect(validation1.success).toBe(false);
    expect(validation2.success).toBe(false);
    expect(validation3.success).toBe(false);
  });

  test('Parse with error if provider id doesn\'t satisfy constraints', () => {
    const validation1 = userUpdateRequest.safeParse({ githubId: '' });
    const validation2 = userUpdateRequest.safeParse({
      githubUsername: 'x'.repeat(PROVIDER_ID_MAX_VALUE + 1)
    });
    const validation3 = userUpdateRequest.safeParse({
      googleId: 'y'.repeat(PROVIDER_ID_MAX_VALUE + 1)
    });

    expect(validation1.success).toBe(false);
    expect(validation2.success).toBe(false);
    expect(validation3.success).toBe(false);
  });

  test('Parse with error if provider is not a supported value', () => {
    const validation = userUpdateRequest.safeParse({ provider: 'gitlab' });

    expect(validation.success).toBe(false);
  });
});