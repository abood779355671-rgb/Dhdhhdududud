import { notFound } from 'next/navigation';
  import { prisma } from '@/lib/prisma';
  import PasswordGate from '@/components/public/PasswordGate';
  import PublicInvitation from '@/components/public/PublicInvitation';

  interface Props { params: { slug: string } }

  export async function generateMetadata({ params }: Props) {
    const inv = await prisma.invitation.findUnique({ where: { slug: params.slug } });
    if (!inv) return { title: 'دعوة غير موجودة' };
    return { title: `دعوة زفاف — ${inv.title}` };
  }

  export default async function PublicInvitationPage({ params }: Props) {
    const inv = await prisma.invitation.findUnique({
      where: { slug: params.slug },
      include: { events: { orderBy: { order: 'asc' } } },
    });
    if (!inv || !inv.isPublished) notFound();
    if (inv.expiresAt && new Date(inv.expiresAt) < new Date()) notFound();

    await prisma.invitation.update({ where: { id: inv.id }, data: { views: { increment: 1 } } });

    const data = JSON.parse(inv.data || '{}');
    const template = inv.templateSnapshot ? JSON.parse(inv.templateSnapshot) : null;

    const invitation = {
      id: inv.id,
      slug: inv.slug,
      title: inv.title,
      brideName: inv.brideName || '',
      groomName: inv.groomName || '',
      weddingDate: inv.weddingDate?.toISOString() || '',
      weddingTime: data.weddingTime || '',
      venue: inv.venueName || '',
      venueAddress: inv.venueAddress || '',
      googleMapsUrl: data.googleMapsUrl,
      coverImage: data.coverImage,
      content: data,
      template,
      events: inv.events,
      showRsvp: data.showRsvp !== false,
      rsvpDeadline: data.rsvpDeadline,
      music: data.music,
      password: inv.password || undefined,
      expiresAt: inv.expiresAt?.toISOString(),
    };

    if (inv.password) return <PasswordGate slug={inv.slug} title={inv.title} />;
    return <PublicInvitation invitation={invitation} />;
  }
  