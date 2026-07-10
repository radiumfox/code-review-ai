import { Issue } from '@/lib/types/review';

export interface ReviewInput {
    userId: string;
    language: string;
    codeSnippet: string;
    model?: string;
}

export interface Review extends ReviewInput {
    summary: string;
    issues?: Issue[]
}