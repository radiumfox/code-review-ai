import { z } from 'zod';
import { ObjectId } from "mongodb";

export const reviewInputSchema = z.object({
    userId: z.instanceof( ObjectId )
        .or( z.string().transform( ObjectId.createFromHexString ) ),
    language: z.string().min(1),
    codeSnippet: z.string().min(1)
});
