import { reviewInputSchema } from '@/lib/validations/reviewInput';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createReview, isAiError } from '@/lib/reviewService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { applyRateLimiter } from '@/lib/server';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if(!session) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    const rateLimitResponse = await applyRateLimiter(`${session.user.id}.${request.url}`);
    if(rateLimitResponse) return rateLimitResponse;

    const body = await request.json();

    const input = reviewInputSchema.safeParse(body);

    if(!input.success) {
      return NextResponse.json(z.treeifyError(input.error), { status: 400 });
    }

    const review = await createReview(session.user.id, input.data);
    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error(error);

    if(isAiError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    
    return NextResponse.json({ error: 'Error creating review' });
  }
}