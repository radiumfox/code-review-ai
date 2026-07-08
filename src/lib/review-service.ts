import {fillTemplate} from "@/lib/helpers/fillTemplate";
import promptTemplate from "@/prompts/code-review-default.json";
import {generateContent} from "@/lib/gen-ai";
import {Candidate} from "@google/genai";
import {reviewSchema} from "@/lib/validations/review";
import {connectToDatabase} from "@/lib/mongoose";
import {ReviewModel} from "@/models/Review";
import {IssueCategory, IssueSeverity} from "@/lib/types";
import {ObjectId} from "mongodb";

interface ReviewInput {
    userId: ObjectId;
    language: string;
    codeSnippet: string;
}

interface Issue {
    line: number;
    severity: IssueSeverity;
    category: IssueCategory;
    message: string;
    suggestion: string
}

interface Review extends ReviewInput {
    summary: string;
    issues?: Issue[]
}

function buildPrompt(input: ReviewInput) {
    return fillTemplate(promptTemplate.template, {
        language: input.language,
        codeSnippet: input.codeSnippet
    });
}

function aiError(message: string, statusCode: number = 502) {
    return { success: false as const, error: message, statusCode };
}

async function callAI(prompt: string) {
    try {
        return await generateContent({
            contents: prompt,
            model: promptTemplate.model
        });
    } catch (error) {
        throw aiError('AI generation failed');
    }
}

function extractText(candidates: Candidate[] | undefined): string | null {
    return candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

function parseAIResponse(aiResponse: Candidate[]) {
    const text = extractText(aiResponse) ?? '';
    return JSON.parse(text);
}

function validateReviewData(data: unknown) {
    const reviewData = reviewSchema.safeParse(data);

    if(!reviewData.success) {
        throw reviewData.error;
    }

    return reviewData.data;
}

async function persistReview(payload: Review) {
    await connectToDatabase();

    return await ReviewModel.create({
        ...payload
    });
}

export async function createReview(input: ReviewInput) {
    const prompt = buildPrompt(input);

    const aiResponse = await callAI(prompt);

    if(!aiResponse) {
        throw aiError('AI returned no candidates', 502);
    }

    const reviewData = await parseAIResponse(aiResponse);
    const validated = validateReviewData(reviewData);
    return persistReview({ ...input, ...validated });
}