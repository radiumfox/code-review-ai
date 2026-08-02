import { NextResponse } from 'next/server';
import { ROUTES } from '@/lib/config';
import { UserModel } from '@/models/User';
import { UserRole } from '@/lib/types';
import { AI_MODEL } from '@/lib/genAI/config';

export async function GET() {
  if (process.env.E2E_TEST !== 'true') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const currentUser = await UserModel.findOneAndUpdate(
    { email: 'e2e@test.local' },
    {
      name: 'E2E Test User',
      email: 'e2e@test.local',
      role: UserRole.User,
      githubUsername: 'e2e-test-user',
      githubId: 0,
      aiModel: AI_MODEL,
    },
    { upsert: true, new: true }
  );

  if(!currentUser) {
    return NextResponse.json({ error: 'Failed to create e2e user' }, { status: 500 });
  }

  const { encode } = await import('next-auth/jwt');
  const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

  const token = {
    id: currentUser._id.toString(),
    aiModel: currentUser.aiModel ?? null,
    email: 'e2e@test.local',
    name: 'E2E Test User',
    sub: 'e2e-test-user',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60
  };

  const encryptedToken = await encode({ token, secret: NEXTAUTH_SECRET });

  const response = NextResponse.redirect(new URL(ROUTES.main, process.env.NEXTAUTH_URL));
  response.cookies.set('next-auth.session-token', encryptedToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: ROUTES.main,
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}