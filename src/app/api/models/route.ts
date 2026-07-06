import { NextRequest, NextResponse } from 'next/server';
import { fetchModels } from '@/lib/gen-ai';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const pageToken = searchParams.get('pageToken') ?? undefined;

  const result = await fetchModels(pageToken);

  return NextResponse.json(result);
}
