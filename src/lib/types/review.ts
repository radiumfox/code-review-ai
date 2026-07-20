import type { CodingLanguage } from '@/lib/types/languages';

export enum IssueSeverity {
    Error = 'error',
    Warning = 'warning',
    Suggestion = 'suggestion'
}

export enum IssueCategory {
    Bug = 'bug',
    Style = 'style',
    Performance = 'performance',
    Security = 'security'
}

export interface Issue {
    line: number;
    severity: IssueSeverity;
    category: IssueCategory;
    message: string;
    suggestion: string
}

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
    createdAt: string;
    language: CodingLanguage;
    codeSnippet: string;
    model?: string;
}