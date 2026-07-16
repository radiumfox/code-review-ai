import { ReviewModel } from "@/models/Review";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';
import { reviewListRequestSchema } from "@/lib/validations/reviewListRequest";
import { z } from "zod";

const REVIEWS_LIMIT = 10;

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

        const list = await ReviewModel.find({ userId: session.user.id }).limit(REVIEWS_LIMIT).skip(REVIEWS_LIMIT * input.data.page);

        return NextResponse.json(list, { status: 200 });
    } catch(error) {
        console.error(error);

        return NextResponse.json({ error: 'Error fetching reviews list' });
    }
}