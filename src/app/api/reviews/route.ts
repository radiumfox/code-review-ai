import { reviewInputSchema } from '@/lib/validations/review-input';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createReview, isAiError } from '@/lib/review-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const input = reviewInputSchema.safeParse(body);

    if(!input.success) {
      return NextResponse.json(z.treeifyError(input.error), { status: 400 });
    }

    const review = await createReview(input.data);
    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    if(isAiError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}