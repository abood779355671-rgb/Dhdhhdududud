import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.OWNER_USERNAME || 'admin';
  const password = process.env.OWNER_PASSWORD || 'admin123';

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    console.log(`✓ حساب المالك موجود مسبقاً: ${username}`);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, password: hashed, name: 'المالك' }
  });

  console.log('═══════════════════════════════════════');
  console.log('✓ تم إنشاء حساب المالك بنجاح');
  console.log('═══════════════════════════════════════');
  console.log(`اسم المستخدم: ${user.username}`);
  console.log(`كلمة المرور : ${password}`);
  console.log('═══════════════════════════════════════');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
