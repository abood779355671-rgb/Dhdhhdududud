import { NextRequest, NextResponse } from 'next/server';
  import { prisma } from '@/lib/prisma';
  import { getAuthUser } from '@/lib/auth';
  import { nanoid } from 'nanoid';

  export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const inv = await prisma.invitation.findFirst({ where: { id: params.id, userId: user.id } });
    if (!inv) return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
    const copy = await prisma.invitation.create({
      data: {
        slug: nanoid(10),
        title: `نسخة من ${inv.title}`,
        brideName: inv.brideName,
        groomName: inv.groomName,
        weddingDate: inv.weddingDate,
        venueName: inv.venueName,
        venueAddress: inv.venueAddress,
        data: inv.data,
        templateSnapshot: inv.templateSnapshot,
        userId: user.id,
      },
    });
    return NextResponse.json(copy);
  }
  