import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { UserModel } from '@/models/User';
import { userModelRequest } from '@/lib/validations/userModelRequest';
import { prettifyError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if(!session) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    const body = await request.json();

    const input = userModelRequest.safeParse(body);

    if(!input.success) {
      const error = prettifyError(input.error);
      return NextResponse.json({ error }, { status: 400 });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user.id,
      { aiModel: input.data.model },
      { new: true }
    );

    if(!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ data: { model: updatedUser.aiModel } }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error saving model' }, { status: 500 });
  }
}
