import { NextResponse } from 'next/server';

export function apiErrorResponse(message: string, code: string, statusCode: number): NextResponse {
  return NextResponse.json({ message, code, statusCode, ok: false }, { status: statusCode });
}