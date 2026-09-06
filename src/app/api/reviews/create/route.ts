import { reviewGenerateRequest } from '@/lib/validations/reviewGenerateRequest';
import { NextRequest } from 'next/server';
import { createReview } from '@/lib/createReviewService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { applyRateLimiter } from '@/lib/server';
import { apiErrorResponse } from '@/lib/api/errors';
import { apiSuccessResponse } from '@/lib/api/result';
import { prettifyError } from 'zod';
import { ERROR_CODES, STATUS_CODE_BY_CODE, isApiError } from '@/lib/api/errors';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if(!session) {
      return apiErrorResponse('Authentication failed', ERROR_CODES.AUTH, STATUS_CODE_BY_CODE[ERROR_CODES.AUTH]);
    }

    const rateLimitResponse = await applyRateLimiter(`${session.user.id}.${request.url}`);
    if(rateLimitResponse) return rateLimitResponse;

    const body = await request.json();

    const input = reviewGenerateRequest.safeParse(body);

    if(!input.success) {
      return apiErrorResponse(prettifyError(input.error), ERROR_CODES.VALIDATION, STATUS_CODE_BY_CODE[ERROR_CODES.VALIDATION]);
    }

    const review = await createReview(session.user.id, input.data);
    return apiSuccessResponse({ ...review._doc, id: review._id });
  } catch (error) {
    console.error(error);

    if(isApiError(error)) {
      return apiErrorResponse(error.message, error.code, error.statusCode);
    }

    return apiErrorResponse('Error creating review', ERROR_CODES.INTERNAL_SERVER, STATUS_CODE_BY_CODE[ERROR_CODES.INTERNAL_SERVER]);
  }
}
