import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { DESIGNS } from '@/lib/templates/designs';
import { PALETTES } from '@/lib/templates/palettes';
import { FONTS } from '@/lib/templates/fonts';
import { buildTemplate } from '@/lib/templates/engine';

/**
 * يولّد القوالب المدمجة الأساسية (تركيبة افتراضية لكل تصميم بأول لون وأول خط)
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  // امسح القوالب المدمجة القديمة وأعد توليدها
  await prisma.template.deleteMany({ where: { isBuiltIn: true } });

  const created: { id: string; name: string }[] = [];

  for (const design of DESIGNS) {
    const palette = PALETTES[0];
    const font = FONTS[0];
    const data = buildTemplate({
      designKey: design.key,
      colorKey: palette.key,
      fontKey: font.key,
      name: design.name
    });

    const t = await prisma.template.create({
      data: {
        name: design.name,
        description: design.description,
        category: design.category,
        isBuiltIn: true,
        designKey: design.key,
        colorKey: palette.key,
        fontKey: font.key,
        data: JSON.stringify(data),
        userId: null
      }
    });
    created.push({ id: t.id, name: t.name });
  }

  return NextResponse.json({
    message: `تم توليد ${created.length} قالب مدمج`,
    templates: created
  });
}
