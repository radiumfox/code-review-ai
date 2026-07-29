import {DEFAULT_LANGUAGE, DEFAULT_MODEL, DEFAULT_MODEL_NAME} from "@/lib/config";

export function mockReview(overrides = {}) {
    return {
        id: 'mock-review-id',
        language: DEFAULT_LANGUAGE,
        codeSnippet: 'let x = 1;',
        model: DEFAULT_MODEL,
        summary: 'Prefer const over let for variables that are never reassigned.',
        issues: [
            {
                line: 1,
                severity: 'warning',
                category: 'style',
                message: 'Prefer const over let',
                suggestion: 'Use const instead of let',
            },
        ],
        createdAt: new Date().toISOString(),
        ...overrides,
    };
}

export const MOCK_MODELS_LIST = [{ name: `models/${DEFAULT_MODEL}`, displayName: DEFAULT_MODEL_NAME }];