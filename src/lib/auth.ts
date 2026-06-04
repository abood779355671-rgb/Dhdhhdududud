import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { verifyToken, JWTPayload } from './jwt';
import { prisma } from './prisma';

export const AUTH_COOKIE_NAME = 'tohfa_token';

export async function getCurrentUserFromCookies(): Promise<JWTPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function getCurrentUserFromRequest(req: NextRequest): Promise<JWTPayload | null> {
  const token =
    req.cookies.get(AUTH_COOKIE_NAME)?.value ||
    req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  return await verifyToken(token);
}

export async function getFullUser() {
  const payload = await getCurrentUserFromCookies();
  if (!payload) return null;
  return await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, username: true, name: true, createdAt: true }
  });
}

// Alias for convenience in API routes
export async function getAuthUser(req: import('next/server').NextRequest) {
  const payload = await getCurrentUserFromRequest(req);
  if (!payload) return null;
  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, username: true, name: true },
  });
}
