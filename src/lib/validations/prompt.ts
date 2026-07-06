import { z } from 'zod';

export const promptSchema = z.object({
    model: z.string(),
});

// model: 'gemini-2.5-flash',
//     contents: 'Why is the sky blue?',