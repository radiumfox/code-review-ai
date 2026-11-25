import type { Issue } from '@/lib/types';

export interface AIReviewResponse {
    summary: string;
    issues: Issue[];
}
