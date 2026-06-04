import { prisma } from '@/lib/prisma';
import RsvpTable from '@/components/dashboard/RsvpTable';

export default async function RsvpsPage() {
  // Auth check handled by middleware
  const rsvps = await prisma.rsvp.findMany({
      include: { invitation: { select: { title: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return (
      <div className="p-6" dir="rtl">
        <h1 className="text-2xl font-amiri text-gold-400 mb-6">ردود الحضور</h1>
        <RsvpTable rsvps={rsvps as any} />
      </div>
    );
  }
  