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
