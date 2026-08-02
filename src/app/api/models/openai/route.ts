import { NextRequest, NextResponse } from 'next/server';
import { fetchModels } from '@/lib/genAI';
import { applyRateLimiter } from '@/lib/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isInvalidApiKeyError } from '@/lib/genAI/helpers';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if(!session) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }

  const rateLimitResponse = await applyRateLimiter(`${session.user.id}.${request.url}`);
  if(rateLimitResponse) return rateLimitResponse;

  try {
    const result = await fetchModels();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);

    if(isInvalidApiKeyError(error)) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 401 });
    }
    return NextResponse.json({ error: 'Error fetching models' }, { status: 500 });
  }
}
