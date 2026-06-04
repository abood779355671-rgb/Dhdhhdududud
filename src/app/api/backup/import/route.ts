import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { restoreFromZip } from '@/lib/backup';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار ملف' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await restoreFromZip(buffer, user.userId);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'فشل الاستعادة. تأكد من صحة ملف النسخ الاحتياطي.' },
      { status: 500 }
    );
  }
}
