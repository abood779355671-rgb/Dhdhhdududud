import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { validateTemplateData } from '@/lib/templates/engine';

export async function GET(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const templates = await prisma.template.findMany({
    where: { OR: [{ userId: user.userId }, { isBuiltIn: true }] },
    orderBy: { updatedAt: 'desc' }
  });

  return NextResponse.json({
    templates: templates.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
      isBuiltIn: t.isBuiltIn,
      designKey: t.designKey,
      colorKey: t.colorKey,
      fontKey: t.fontKey,
      thumbnail: t.thumbnail,
      data: JSON.parse(t.data),
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    }))
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, description, category, data, designKey, colorKey, fontKey } = body;

    if (!name || !data) {
      return NextResponse.json({ error: 'البيانات ناقصة' }, { status: 400 });
    }

    if (!validateTemplateData(data)) {
      return NextResponse.json({ error: 'بنية القالب غير صالحة' }, { status: 400 });
    }

    const template = await prisma.template.create({
      data: {
        name,
        description: description || null,
        category: category || 'custom',
        isBuiltIn: false,
        designKey: designKey || data.designKey,
        colorKey: colorKey || data.colorKey,
        fontKey: fontKey || data.fontKey,
        data: JSON.stringify(data),
        userId: user.userId
      }
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'فشل الحفظ' }, { status: 500 });
  }
}
