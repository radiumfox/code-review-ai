import { ReviewModel } from '@/models/Review';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest } from 'next/server';
import { reviewListRequestSchema } from '@/lib/validations/reviewListRequest';
import { REVIEWS_LIST_LIMIT } from '@/lib/config';
import { ObjectId } from 'mongodb';
import { prettifyError } from 'zod';
import { apiErrorResponse } from '@/lib/api/errors';
import { apiSuccessResponse } from '@/lib/api/result';
import { ERROR_CODES, STATUS_CODE_BY_CODE } from '@/lib/api/errors';
import { connectToDatabase } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if(!session) {
      return apiErrorResponse('Authentication failed', ERROR_CODES.AUTH, STATUS_CODE_BY_CODE[ERROR_CODES.AUTH]);
    }

    const body = await request.json();
    const input = reviewListRequestSchema.safeParse(body);

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