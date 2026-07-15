import { Issue } from '@/lib/types/review';

export interface ReviewInput {
    language: string;
    codeSnippet: string;
    model?: string;
}

export interface Review extends ReviewInput {
    userId: string;
    summary: string;
    issues?: Issue[]
}