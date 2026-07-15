import { NextRequest, NextResponse } from 'next/server';
import { fetchModels } from '@/lib/genAI';
import { applyRateLimiter } from '@/lib/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if(!session) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url ?? '');

  const pageToken = searchParams.get('pageToken') ?? undefined;

  const rateLimitResponse = await applyRateLimiter(`${session.user.id}.${request.url}`);
  if(rateLimitResponse) return rateLimitResponse;

  try {
    const result = await fetchModels(pageToken);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching models' });
  }
}
