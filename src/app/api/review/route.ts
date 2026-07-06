import { connectToDatabase } from '@/lib/mongoose';
import { ReviewModel } from '@/models/Review';
import { reviewSchema } from '@/lib/validations/review';
import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = reviewSchema.safeParse(body);

  if(!validation.success) {
    return NextResponse.json(z.treeifyError(validation.error), { status: 400 });
  }

  try {
    await connectToDatabase();

    const review = await ReviewModel.create(validation.data);
  } catch (error) {
    console.error(error);
  }

  return NextResponse.json(body);
}