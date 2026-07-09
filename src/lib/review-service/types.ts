import { ObjectId } from 'mongodb';
import { IssueCategory, IssueSeverity } from '@/lib/types/review';

export interface ReviewInput {
    userId: ObjectId;
    language: string;
    codeSnippet: string;
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