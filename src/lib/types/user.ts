export enum UserRole {
    Admin = 'admin',
    User = 'user'
}

export enum AuthProvider {
    Github = 'github',
    Google = 'google'
}

export interface User {
    id: string;
    name: string;
    email: string;
    provider: AuthProvider;
    githubId?: string;
    githubUsername?: string;
    googleId?: string;
    aiModel: string | null;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export const USER_IMMUTABLE_FIELDS = [
  'email',
  'provider',
  'githubId',
  'githubUsername',
  'googleId',
  'role',
  'name'
] as const;

export type UserImmutableField = typeof USER_IMMUTABLE_FIELDS[number];
