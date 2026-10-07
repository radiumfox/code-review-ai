import { ReviewModel } from '@/models/Review';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest } from 'next/server';
import { reviewListRequestSchema } from '@/lib/validations/reviewListRequest';
import { REVIEWS_LIST_LIMIT } from '@/lib/config';
import { ObjectId } from 'mongodb';
import { prettifyError } from 'zod';
import { apiErrorResponse, isApiError } from '@/lib/api/errors';
import { apiSuccessResponse } from '@/lib/api/result';
import { ERROR_CODES, STATUS_CODE_BY_CODE } from '@/lib/api/errors';
import { applyRateLimiter, connectToDatabase } from '@/lib/api';
import { reviewGenerateRequest } from '@/lib/validations/reviewGenerateRequest';
import { reviewDeleteRequestSchema } from '@/lib/validations/reviewDeleteRequest';
import { createReview } from '@/server/reviews';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if(!session) {
      return apiErrorResponse('Authentication failed', ERROR_CODES.AUTH, STATUS_CODE_BY_CODE[ERROR_CODES.AUTH]);
    }

    const searchParams = request.nextUrl.searchParams;
    const input = reviewListRequestSchema.safeParse(Object.fromEntries(searchParams));

    if(!input.success) {
      return apiErrorResponse(prettifyError(input.error), ERROR_CODES.VALIDATION, STATUS_CODE_BY_CODE[ERROR_CODES.VALIDATION]);
    }

    await connectToDatabase();

    const result = await ReviewModel.aggregate([
      { $match: { userId: { $eq: new ObjectId(session.user.id) } }, },
      {
        $sort: {
          createdAt: -1
        },
      },
      {
        $set: {
          'id': '$_id'
        }
      },
      {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          data: [{ $skip: REVIEWS_LIST_LIMIT * input.data.page }, { $limit: REVIEWS_LIST_LIMIT }],
        },
      }
    ]);

    const data = {
      metadata: {
        totalCount: result[0]?.metadata[0]?.totalCount,
        page: input.data.page,
        pageSize: REVIEWS_LIST_LIMIT
      },
      data: result[0]?.data
    };

    return apiSuccessResponse(data);
  } catch(error) {
    console.error(error);

    return apiErrorResponse('Error fetching reviews list', ERROR_CODES.INTERNAL_SERVER, STATUS_CODE_BY_CODE[ERROR_CODES.INTERNAL_SERVER]);
  }
}

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

    await connectToDatabase();

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

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if(!session) {
      return apiErrorResponse('Authentication failed', ERROR_CODES.AUTH, STATUS_CODE_BY_CODE[ERROR_CODES.AUTH]);
    }

    const body = await request.json().catch(() => null);
    const input = reviewDeleteRequestSchema.safeParse(body);

    if(!input.success) {
      return apiErrorResponse(prettifyError(input.error), ERROR_CODES.VALIDATION, STATUS_CODE_BY_CODE[ERROR_CODES.VALIDATION]);
    }

    await connectToDatabase();

    const objectIds = [...new Set(input.data.ids)].map(id => new ObjectId(id));

    const reviewsToDelete = await ReviewModel.find(
      { _id: { $in: objectIds }, userId: new ObjectId(session.user.id) },
      { _id: 1 }
    );

    const deletedIds = reviewsToDelete.map(review => String(review._id));

    if(deletedIds.length) {
      await ReviewModel.deleteMany({
        _id: { $in: reviewsToDelete.map(review => review._id) },
        userId: new ObjectId(session.user.id)
      });
    }

    return apiSuccessResponse({ deletedCount: deletedIds.length, deletedIds });
  } catch(error) {
    console.error(error);

    return apiErrorResponse('Error deleting reviews', ERROR_CODES.INTERNAL_SERVER, STATUS_CODE_BY_CODE[ERROR_CODES.INTERNAL_SERVER]);
  }
}