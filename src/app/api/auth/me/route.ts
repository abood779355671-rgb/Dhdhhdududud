import { NextResponse } from 'next/server';
import { getFullUser } from '@/lib/auth';

export async function GET() {
  const user = await getFullUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}
