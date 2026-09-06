import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { UserModel } from '@/models/User';
import { userModelRequest } from '@/lib/validations/userModelRequest';
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

    const input = userModelRequest.safeParse(body);

    if(!input.success) {
      return apiErrorResponse(prettifyError(input.error), ERROR_CODES.VALIDATION, STATUS_CODE_BY_CODE[ERROR_CODES.VALIDATION]);
    }

    await connectToDatabase();

    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user.id,
      { aiModel: input.data.model },
      { new: true }
    );

    if(!updatedUser) {
      return apiErrorResponse('User not found', ERROR_CODES.NOT_FOUND, STATUS_CODE_BY_CODE[ERROR_CODES.NOT_FOUND]);
    }

    return apiSuccessResponse({ model: updatedUser.aiModel });
  } catch (error) {
    console.error(error);
    return apiErrorResponse('Error saving model', ERROR_CODES.INTERNAL_SERVER, STATUS_CODE_BY_CODE[ERROR_CODES.INTERNAL_SERVER]);
  }
}
