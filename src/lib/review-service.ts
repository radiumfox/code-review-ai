import {fillTemplate} from "@/lib/helpers/fillTemplate";
import promptTemplate from "@/prompts/code-review-default.json";
import {generateContent} from "@/lib/gen-ai";
import {Candidate} from "@google/genai";
import {reviewSchema} from "@/lib/validations/review";
import {connectToDatabase} from "@/lib/mongoose";
import {ReviewModel} from "@/models/Review";
import {NextResponse} from "next/server";
import {IssueCategory, IssueSeverity} from "@/lib/types";
import { ObjectId } from "mongodb";

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
    summary?: string;
    issues?: Issue[]
}

function buildPrompt(input: ReviewInput) {
    return fillTemplate(promptTemplate.template, {
        language: input.language,
        codeSnippet: input.codeSnippet
    });
}

async function callAI(prompt: string) {
    try {
        return await generateContent({
            contents: prompt,
            model: promptTemplate.model
        });
    } catch (error) {
        console.error(error);
    }
}

function extractText(candidates: Candidate[] | undefined): string | null {
    return candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

async function parseAIResponse(aiResponse: Candidate[]) {
    try {
        const text = extractText(aiResponse) ?? '';

        return JSON.parse(text);
    } catch (error) {
        console.error(error);
    }
}

function validateReviewData(data: unknown) {
    const reviewData = reviewSchema.safeParse(data);

    if(!reviewData.success) {
        return undefined;
    }

    return reviewData.data;
}

async function persistReview(payload: Review) {
    try {
        await connectToDatabase();

        const review = await ReviewModel.create({
            ...payload
        });

        return NextResponse.json(review, { status: 200 });
    } catch (error) {
        console.error('Error creating review');
        return undefined;
    }
}

export async function createReview(input: ReviewInput) {
    const prompt = buildPrompt(input);
    const aiResponse = await callAI(prompt);

    if(!aiResponse) {
        console.error('Error creating review');
        return undefined;
    }

    const reviewData = await parseAIResponse(aiResponse);
    const validated = validateReviewData(reviewData);
    return persistReview({ ...input, ...validated });
}