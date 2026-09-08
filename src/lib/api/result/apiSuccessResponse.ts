import { NextResponse } from 'next/server';

export function apiSuccessResponse<T>(data: T, statusCode = 200): NextResponse {
  return NextResponse.json({ ok: true, data }, { status: statusCode });
}