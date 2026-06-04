# إعداد مشروع تحفة

  ## المتطلبات
  - Node.js 18+
  - npm أو pnpm

  ## خطوات الإعداد

  ```bash
  # 1. تثبيت الحزم
  npm install

  # 2. إنشاء ملف البيئة
  cp .env.example .env
  # عدّل .env وأضف قيمة JWT_SECRET قوية

  # 3. إنشاء قاعدة البيانات
  npx prisma db push

  # 4. إنشاء حساب المالك
  npx ts-node scripts/seed-owner.ts

  # 5. تشغيل المشروع
  npm run dev
  ```

  ## الوصول
  - الأداة: http://localhost:3000
  - تسجيل الدخول: http://localhost:3000/login
  - لوحة التحكم: http://localhost:3000/dashboard

  ## بيانات الدخول الافتراضية
  حسب ما ضبطته في ملف .env (OWNER_USERNAME / OWNER_PASSWORD)
  