import { NextRequest } from 'next/server';
import { fetchModels } from '@/lib/genAI/openai';
import { applyRateLimiter } from '@/lib/api';
import { apiErrorResponse } from '@/lib/api/errors';
import { apiSuccessResponse } from '@/lib/api/result';
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

    return apiSuccessResponse(result);
  } catch (error) {
    console.error(error);

    if(isInvalidApiKeyError(error)) {
      return apiErrorResponse(error.message, error.code, STATUS_CODE_BY_CODE[ERROR_CODES.AUTH]);
    }
    return apiErrorResponse('Error fetching models', ERROR_CODES.INTERNAL_SERVER, STATUS_CODE_BY_CODE[ERROR_CODES.INTERNAL_SERVER]);
  }
}
