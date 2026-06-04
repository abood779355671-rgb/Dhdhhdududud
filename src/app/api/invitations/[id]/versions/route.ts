import { NextRequest, NextResponse } from 'next/server';
  import { prisma } from '@/lib/prisma';
  import { getAuthUser } from '@/lib/auth';

  export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const versions = await prisma.invitationVersion.findMany({
      where: { invitationId: params.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json(versions);
  }

  export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const inv = await prisma.invitation.findFirst({ where: { id: params.id, userId: user.id } });
    if (!inv) return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
    const body = await req.json();
    const version = await prisma.invitationVersion.create({
      data: { invitationId: params.id, data: inv.data, note: body.note },
    });
    return NextResponse.json(version);
  }
  