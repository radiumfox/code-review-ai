import { ObjectId } from 'mongodb';
import { IssueCategory, IssueSeverity } from '@/lib/types/review';

export interface ReviewInput {
    userId: ObjectId | undefined;
    language: string;
    codeSnippet: string;
    model?: string;
}

export interface Issue {
    line: number;
    severity: IssueSeverity;
    category: IssueCategory;
    message: string;
    suggestion: string
}

export interface Review extends ReviewInput {
    summary: string;
    issues?: Issue[]
}