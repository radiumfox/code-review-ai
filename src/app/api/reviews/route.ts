import { ReviewModel } from '@/models/Review';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';
import { reviewListRequestSchema } from '@/lib/validations/reviewListRequest';
import { z } from 'zod';
import { REVIEWS_LIST_LIMIT } from '@/lib/config';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if(!session) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    const body = await request.json();
    const input = reviewListRequestSchema.safeParse(body);

    if(!input.success) {
      return NextResponse.json(z.treeifyError(input.error), { status: 400 });
    }

    const result = await ReviewModel.aggregate([


      { $match: { userId: { $eq: new ObjectId(session.user.id) } }, },
      {
        $sort: {
          createdAt: -1
        },
      },
      {
        $set: {
          "id": "$_id"
        }
      },
      {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          data: [{ $skip: REVIEWS_LIST_LIMIT * input.data.page }, { $limit: REVIEWS_LIST_LIMIT }],
        },
      }
    ]);

    console.log(result);

    const data = {
      metadata: {
        totalCount: result[0]?.metadata[0]?.totalCount,
        page: input.data.page,
        pageSize: REVIEWS_LIST_LIMIT
      },
      data: result[0]?.data
    };

    return NextResponse.json(data, { status: 200 });
  } catch(error) {
    console.error(error);

    return NextResponse.json({ error: 'Error fetching reviews list' }, { status: 500 });
  }
}