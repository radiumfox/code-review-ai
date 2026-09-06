import { NextRequest, NextResponse } from 'next/server';
import { fetchModels } from '@/lib/genAI/openai';
import { applyRateLimiter, apiErrorResponse } from '@/lib/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isInvalidApiKeyError } from '@/lib/genAI/openai/helpers';
import { ERROR_CODES, STATUS_CODE_BY_CODE } from '@/lib/api/errors';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if(!session) {
    return apiErrorResponse('Authentication failed', ERROR_CODES.AUTH, STATUS_CODE_BY_CODE[ERROR_CODES.AUTH]);
  }

  const rateLimitResponse = await applyRateLimiter(`${session.user.id}.${request.url}`);
  if(rateLimitResponse) return rateLimitResponse;

  try {
    const result = await fetchModels();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);

    if(isInvalidApiKeyError(error)) {
      return apiErrorResponse(error.message, error.code, STATUS_CODE_BY_CODE[ERROR_CODES.AUTH]);
    }
    return apiErrorResponse('Error fetching models', ERROR_CODES.INTERNAL_SERVER, STATUS_CODE_BY_CODE[ERROR_CODES.INTERNAL_SERVER]);
  }
}
