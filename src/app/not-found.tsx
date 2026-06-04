import Link from 'next/link';
import Logo from '@/components/Logo';
import DecorationOrnament from '@/components/DecorationOrnament';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-luxury">
      <div className="max-w-md text-center space-y-6 animate-fade-in-up">
        <Logo size={90} />
        <DecorationOrnament variant="divider" width={240} className="mx-auto" />

        <div className="space-y-3">
          <h1 className="text-7xl font-bold gold-text font-amiri">404</h1>
          <h2 className="text-2xl font-amiri text-gold-100">الصفحة غير موجودة</h2>
          <p className="text-gold-100/60 font-naskh leading-relaxed">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 btn-gold !no-underline"
        >
          <Home size={16} />
          العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
