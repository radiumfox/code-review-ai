import { z } from 'zod';
import {IssueCategory, IssueSeverity} from '@/lib/types';

export const reviewSchema = z.object({
    summary: z.string().min(1),
    issues: z.array(
        z.object({
            line: z.number().min(1),
            severity: z.enum(IssueSeverity),
            category: z.enum(IssueCategory),
            message: z.string().min(1),
            suggestion: z.string().min(1)
        })
    ).optional()
})