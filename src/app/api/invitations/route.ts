import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { buildTemplate, validateTemplateData } from '@/lib/templates/engine';
import { nanoid } from 'nanoid';

export async function GET(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const invitations = await prisma.invitation.findMany({
    where: { userId: user.userId },
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { rsvps: true } } }
  });

  return NextResponse.json({
    invitations: invitations.map((i) => ({
      id: i.id,
      slug: i.slug,
      title: i.title,
      brideName: i.brideName,
      groomName: i.groomName,
      weddingDate: i.weddingDate,
      views: i.views,
      isPublished: i.isPublished,
      rsvpCount: i._count.rsvps,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
      data: JSON.parse(i.data)
    }))
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const body = await req.json();
    const { title, designKey, colorKey, fontKey, templateId } = body;

    let data;
    if (templateId) {
      const t = await prisma.template.findUnique({ where: { id: templateId } });
      if (!t) return NextResponse.json({ error: 'القالب غير موجود' }, { status: 404 });
      data = JSON.parse(t.data);
    } else {
      data = buildTemplate({
        designKey: designKey || 'classic-luxe',
        colorKey: colorKey || 'gold-ivory',
        fontKey: fontKey || 'amiri'
      });
    }

    if (!validateTemplateData(data)) {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 });
    }

    const slug = nanoid(10);

    const invitation = await prisma.invitation.create({
      data: {
        slug,
        title: title || 'دعوة بدون عنوان',
        data: JSON.stringify(data),
        userId: user.userId
      }
    });

    return NextResponse.json({ invitation });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'فشل الإنشاء' }, { status: 500 });
  }
}
