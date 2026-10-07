import { ReviewModel } from '@/models/Review';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { apiErrorResponse, ERROR_CODES, STATUS_CODE_BY_CODE } from '@/lib/api/errors';
import { apiSuccessResponse } from '@/lib/api/result';
import { connectToDatabase } from '@/lib/api';

interface ReviewItemRouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: ReviewItemRouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if(!session) {
      return apiErrorResponse('Authentication failed', ERROR_CODES.AUTH, STATUS_CODE_BY_CODE[ERROR_CODES.AUTH]);
    }

    const { id } = await params;

    if(!ObjectId.isValid(id)) {
      return apiErrorResponse('Invalid review id', ERROR_CODES.VALIDATION, STATUS_CODE_BY_CODE[ERROR_CODES.VALIDATION]);
    }

    await connectToDatabase();

    const deletedReview = await ReviewModel.findOneAndDelete({
      _id: new ObjectId(id),
      userId: new ObjectId(session.user.id)
    });

    if(!deletedReview) {
      return apiErrorResponse('Review not found', ERROR_CODES.NOT_FOUND, STATUS_CODE_BY_CODE[ERROR_CODES.NOT_FOUND]);
    }

    return apiSuccessResponse({ id: deletedReview._id });
  } catch(error) {
    console.error(error);

    return apiErrorResponse('Error deleting review', ERROR_CODES.INTERNAL_SERVER, STATUS_CODE_BY_CODE[ERROR_CODES.INTERNAL_SERVER]);
  }
}
