import { NextRequest, NextResponse } from 'next/server';
  import { prisma } from '@/lib/prisma';
  import { getAuthUser } from '@/lib/auth';

  export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const inv = await prisma.invitation.findFirst({
      where: { id: params.id, userId: user.id },
      include: { events: { orderBy: { order: 'asc' } }, rsvps: true },
    });
    if (!inv) return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
    return NextResponse.json(inv);
  }

  export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const inv = await prisma.invitation.findFirst({ where: { id: params.id, userId: user.id } });
    if (!inv) return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
    const body = await req.json();
    const updated = await prisma.invitation.update({
      where: { id: params.id },
      data: {
        title: body.title ?? inv.title,
        brideName: body.brideName,
        groomName: body.groomName,
        weddingDate: body.weddingDate ? new Date(body.weddingDate) : inv.weddingDate,
        venueName: body.venueName,
        venueAddress: body.venueAddress,
        password: body.password,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : inv.expiresAt,
        isPublished: body.isPublished ?? inv.isPublished,
        data: body.data ? JSON.stringify(body.data) : inv.data,
        templateSnapshot: body.templateSnapshot ? JSON.stringify(body.templateSnapshot) : inv.templateSnapshot,
      },
    });
    return NextResponse.json(updated);
  }

  export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const inv = await prisma.invitation.findFirst({ where: { id: params.id, userId: user.id } });
    if (!inv) return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
    await prisma.invitation.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  }
  