import { reviewGenerateRequest } from '@/lib/validations/reviewGenerateRequest';
import { NextRequest, NextResponse } from 'next/server';
import { createReview, isAiError } from '@/lib/createReviewService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { applyRateLimiter } from '@/lib/server';
import { prettifyError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if(!session) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    const rateLimitResponse = await applyRateLimiter(`${session.user.id}.${request.url}`);
    if(rateLimitResponse) return rateLimitResponse;

    const body = await request.json();

    const input = reviewGenerateRequest.safeParse(body);

    if(!input.success) {
      const error = prettifyError(input.error);
      return NextResponse.json({ error }, { status: 400 });
    }

    const review = await createReview(session.user.id, input.data);
    return NextResponse.json({ data: { ...review._doc, id: review._id } }, { status: 200 });
  } catch (error) {
    console.error(error);

    if(isAiError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    
    return NextResponse.json({ error: 'Error creating review' }, { status: 500 });
  }
}
