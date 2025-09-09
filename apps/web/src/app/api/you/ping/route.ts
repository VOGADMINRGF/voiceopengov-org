import { NextResponse } from 'next/server';
import { youQuery } from '@features/ai/youClient';

export async function GET() {
  const result = await youQuery('Who is the current UN Secretary-General?', { locale: 'en' });
  return NextResponse.json(result);
}
