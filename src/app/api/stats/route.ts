import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const invitations = await prisma.invitation.findMany({
    where: { userId: user.userId },
    select: { id: true, views: true }
  });

  const invIds = invitations.map((i) => i.id);

  const [rsvps, templates, invCount] = await Promise.all([
    prisma.rsvp.findMany({
      where: { invitationId: { in: invIds } },
      select: { attending: true, guestsCount: true, isRead: true }
    }),
    prisma.template.count({ where: { userId: user.userId } }),
    Promise.resolve(invitations.length)
  ]);

  const totalViews = invitations.reduce((acc, i) => acc + i.views, 0);
  const attending = rsvps.filter((r) => r.attending).length;
  const declined = rsvps.filter((r) => !r.attending).length;
  const totalGuests = rsvps
    .filter((r) => r.attending)
    .reduce((acc, r) => acc + 1 + r.guestsCount, 0);
  const unread = rsvps.filter((r) => !r.isRead).length;

  return NextResponse.json({
    invitations: invCount,
    templates,
    totalViews,
    totalRsvps: rsvps.length,
    attending,
    declined,
    totalGuests,
    unread
  });
}
