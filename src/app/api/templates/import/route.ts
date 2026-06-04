import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { validateTemplateData } from '@/lib/templates/engine';

export async function POST(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const body = await req.json();
    const { data, name } = body;

    if (!validateTemplateData(data)) {
      return NextResponse.json({ error: 'بنية القالب غير صالحة' }, { status: 400 });
    }

    const template = await prisma.template.create({
      data: {
        name: name || data.meta?.name || 'قالب مستورد',
        description: data.meta?.description || null,
        category: 'imported',
        isBuiltIn: false,
        designKey: data.designKey,
        colorKey: data.colorKey,
        fontKey: data.fontKey,
        data: JSON.stringify(data),
        userId: user.userId
      }
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'فشل الاستيراد' }, { status: 500 });
  }
}
