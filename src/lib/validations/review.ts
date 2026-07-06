import { z } from 'zod';
import {ObjectId} from "mongodb";
import {IssueCategory, IssueSeverity} from "@/lib/types";

export const reviewSchema = z.object({
    userId: z.instanceof( ObjectId )
        .or( z.undefined() )
        .or( z.string().transform( ObjectId.createFromHexString ) ),
    language: z.string().min(1),
    codeSnippet: z.string().min(1),
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
});