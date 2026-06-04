import { NextRequest, NextResponse } from 'next/server';
  import { prisma } from '@/lib/prisma';

  export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    const inv = await prisma.invitation.findUnique({
      where: { slug: params.slug },
      include: { events: { orderBy: { order: 'asc' } } },
    });
    if (!inv || !inv.isPublished) return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
    if (inv.expiresAt && new Date(inv.expiresAt) < new Date())
      return NextResponse.json({ error: 'انتهت صلاحية الدعوة' }, { status: 410 });
    return NextResponse.json(inv);
  }
  