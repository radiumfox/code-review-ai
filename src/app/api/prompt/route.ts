import { googleGenAI } from '@/lib/gen-ai';
import {NextRequest} from 'next/server';

export async function GET(request: NextRequest) {
  const body = await request.json();
}