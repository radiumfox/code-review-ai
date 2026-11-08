import { describe, expect, test } from 'vitest';
import { userUpdateRequest } from './userUpdateRequest';
import { FREE_AI_MODELS } from '@/lib/config';
import { AuthProvider, USER_IMMUTABLE_FIELDS, UserRole } from '@/lib/types';
import type { UserImmutableField } from '@/lib/types';

const PAYLOAD_BY_FIELD: Readonly<Record<UserImmutableField, unknown>> = {
  email: 'attacker@example.com',
  provider: AuthProvider.Github,
  githubId: '123456',
  githubUsername: 'attacker',
  googleId: '654321',
  role: UserRole.Admin,
  name: 'Attacker',
};

describe('userUpdateRequest', () => {
  test('Accepts an allowed model', () => {
    const validation = userUpdateRequest.safeParse({ aiModel: FREE_AI_MODELS[0] });
    expect(validation.success).toBe(true);
  });

  test('Accepts null model', () => {
    expect(userUpdateRequest.safeParse({ aiModel: null }).success).toBe(true);
  });

  test('Rejects a model outside the allowlist', () => {
    expect(userUpdateRequest.safeParse({ aiModel: 'gpt-4' }).success).toBe(false);
  });

  test.each(USER_IMMUTABLE_FIELDS)(
    'Rejects mass-assignment field %s',
    (field) => {
      const result = userUpdateRequest.safeParse({ [field]: PAYLOAD_BY_FIELD[field] });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some(
            (issue) => issue.code === 'unrecognized_keys' && issue.keys.includes(field),
          ),
        ).toBe(true);
      }
    },
  );

  test('Rejects an empty body', () => {
    expect(userUpdateRequest.safeParse({}).success).toBe(false);
  });
});
