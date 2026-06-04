import { NextRequest, NextResponse } from 'next/server';
  import { prisma } from '@/lib/prisma';

  export async function POST(req: NextRequest) {
    const body = await req.json();
    const { invitationId, guestName, phone, attending, guestsCount, note } = body;
    if (!invitationId || !guestName)
      return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
    const inv = await prisma.invitation.findUnique({ where: { id: invitationId } });
    if (!inv) return NextResponse.json({ error: 'دعوة غير موجودة' }, { status: 404 });
    const rsvp = await prisma.rsvp.create({
      data: { invitationId, guestName, phone, attending, guestsCount: guestsCount || 0, note },
    });
    return NextResponse.json(rsvp);
  }
  