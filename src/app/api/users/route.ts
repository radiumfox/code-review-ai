import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { UserModel } from '@/models/User';
import { userUpdateRequest } from '@/lib/validations/userUpdateRequest';
import { prettifyError } from 'zod';
import { apiErrorResponse } from '@/lib/api/errors';
import { apiSuccessResponse } from '@/lib/api/result';
import { ERROR_CODES, STATUS_CODE_BY_CODE } from '@/lib/api/errors';
import { connectToDatabase } from '@/lib/api';
import { type User } from '@/lib/types';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if(!session) {
      return apiErrorResponse('Authentication failed', ERROR_CODES.AUTH, STATUS_CODE_BY_CODE[ERROR_CODES.AUTH]);
    }

    const body = await request.json();

    const input = userUpdateRequest.safeParse(body);

    if(!input.success) {
      return apiErrorResponse(prettifyError(input.error), ERROR_CODES.VALIDATION, STATUS_CODE_BY_CODE[ERROR_CODES.VALIDATION]);
    }

    await connectToDatabase();

    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user.id,
      input.data,
      { new: true, runValidators: true }
    );

    if(!updatedUser) {
      return apiErrorResponse('User not found', ERROR_CODES.NOT_FOUND, STATUS_CODE_BY_CODE[ERROR_CODES.NOT_FOUND]);
    }

    const user = updatedUser.toObject();

    return apiSuccessResponse<User>({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      provider: user.provider,
      githubId: user.githubId,
      githubUsername: user.githubUsername,
      googleId: user.googleId,
      aiModel: user.aiModel ?? null,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error(error);
    return apiErrorResponse('Error updating user', ERROR_CODES.INTERNAL_SERVER, STATUS_CODE_BY_CODE[ERROR_CODES.INTERNAL_SERVER]);
  }
}