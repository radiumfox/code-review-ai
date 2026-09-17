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