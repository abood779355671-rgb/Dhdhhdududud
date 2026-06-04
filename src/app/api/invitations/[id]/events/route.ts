import { NextRequest, NextResponse } from 'next/server';
  import { prisma } from '@/lib/prisma';
  import { getAuthUser } from '@/lib/auth';

  export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const events = await prisma.weddingEvent.findMany({
      where: { invitationId: params.id },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(events);
  }

  export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await req.json();
    await prisma.weddingEvent.deleteMany({ where: { invitationId: params.id } });
    const events = await prisma.weddingEvent.createMany({
      data: (body as any[]).map((e, i) => ({
        invitationId: params.id,
        title: e.title,
        description: e.description,
        startTime: new Date(e.startTime),
        endTime: e.endTime ? new Date(e.endTime) : null,
        location: e.location,
        order: i,
      })),
    });
    return NextResponse.json({ ok: true, count: events.count });
  }
  