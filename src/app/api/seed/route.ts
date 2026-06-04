import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const username = process.env.OWNER_USERNAME || 'admin';
    const password = process.env.OWNER_PASSWORD || 'admin123';

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ message: 'المالك موجود مسبقاً', username });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashed, name: 'المالك' }
    });

    return NextResponse.json({
      message: 'تم إنشاء حساب المالك بنجاح',
      username: user.username
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'فشل الإنشاء' }, { status: 500 });
  }
}
