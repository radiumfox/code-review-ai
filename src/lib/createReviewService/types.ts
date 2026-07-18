import { Issue } from '@/lib/types/review';

export interface ReviewGenerateRequest {
    language: string;
    codeSnippet: string;
    model?: string;
}

export interface ReviewPersistRequest {
    summary: string;
    issues?: Issue[];
    language: string;
    codeSnippet: string;
    model?: string;
}

export interface Review {
    summary: string;
    issues?: Issue[];
    createdAt: Date;
    language: string;
    codeSnippet: string;
    model?: string;
}