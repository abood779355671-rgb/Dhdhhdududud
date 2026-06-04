'use client';

import { useEffect, useState } from 'react';
import Logo from '@/components/Logo';
import { Save, User, Lock, Info } from 'lucide-react';

interface MeUser {
  id: string;
  username: string;
  name: string | null;
}

export default function SettingsPage() {
  const [user, setUser] = useState<MeUser | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((j) => {
        if (j.user) setUser(j.user);
      });
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold gold-text font-amiri">الإعدادات</h1>
        <p className="text-gold-100/60 mt-2 font-naskh">إعدادات الحساب والتطبيق</p>
      </header>

      <div className="space-y-5">
        <div className="card-dark p-6">
          <h3 className="text-lg font-bold gold-text font-amiri mb-4 flex items-center gap-2">
            <User size={18} /> حساب المالك
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">اسم المستخدم</label>
              <input value={user?.username || ''} readOnly className="input-gold opacity-70" />
            </div>
            <div>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">الاسم</label>
              <input value={user?.name || '—'} readOnly className="input-gold opacity-70" />
            </div>
          </div>
          <p className="text-xs text-gold-100/40 mt-3 font-naskh">
            لتغيير كلمة المرور، عدّل قيمة <code className="text-gold-300">OWNER_PASSWORD</code>{' '}
            في ملف <code className="text-gold-300">.env</code> ثم أعد تشغيل{' '}
            <code className="text-gold-300">npm run seed:owner</code>.
          </p>
        </div>

        <div className="card-dark p-6">
          <h3 className="text-lg font-bold gold-text font-amiri mb-4 flex items-center gap-2">
            <Info size={18} /> حول التطبيق
          </h3>
          <div className="flex items-center gap-6">
            <Logo size={70} />
            <div className="space-y-1 text-sm font-naskh">
              <p className="text-gold-100">
                <span className="text-gold-100/60">الاسم:</span> تحفة
              </p>
              <p className="text-gold-100">
                <span className="text-gold-100/60">الإصدار:</span> 1.0.0
              </p>
              <p className="text-gold-100">
                <span className="text-gold-100/60">الوضع:</span> شخصي (مستخدم واحد)
              </p>
            </div>
          </div>
        </div>

        <div className="card-dark p-6">
          <h3 className="text-lg font-bold gold-text font-amiri mb-4 flex items-center gap-2">
            <Lock size={18} /> الأمان
          </h3>
          <ul className="text-sm text-gold-100/70 font-naskh space-y-2">
            <li>✓ تشفير كلمات المرور بـ bcrypt</li>
            <li>✓ JWT مع HTTP-only Cookie</li>
            <li>✓ Middleware حماية للوحة التحكم</li>
            <li>✓ كلمة مرور اختيارية لكل دعوة</li>
            <li>✓ تاريخ انتهاء صلاحية لكل دعوة</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
