'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/SplashScreen';
import Logo from '@/components/Logo';
import DecorationOrnament from '@/components/DecorationOrnament';
import Footer from '@/components/Footer';
import { Sparkles, Palette, Shield, FileDown } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        setIsLoggedIn(!!data.user);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, []);

  const handleEnter = () => {
    if (isLoggedIn) router.push('/dashboard');
    else router.push('/login');
  };

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  const features = [
    { icon: Palette, label: '1000 تركيبة', desc: '10 تصاميم × 10 ألوان × 10 خطوط' },
    { icon: Sparkles, label: 'محرر متقدم', desc: 'تحكم كامل وحر بكل عنصر' },
    { icon: Shield, label: 'حماية شاملة', desc: 'كلمات مرور وتاريخ انتهاء' },
    { icon: FileDown, label: 'تصدير فوري', desc: 'PDF، QR، طباعة، نسخ احتياطي' }
  ];

  return (
    <main className="min-h-screen flex flex-col bg-luxury">
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-3xl text-center space-y-8 animate-fade-in-up">
          <Logo size={140} showTagline />

          <DecorationOrnament variant="divider" width={280} className="mx-auto" />

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold gold-text font-amiri leading-tight">
              مرحباً بك في تحفة
            </h1>
            <p className="text-gold-100/70 text-base md:text-lg leading-relaxed font-naskh max-w-xl mx-auto">
              منصتك الخاصة لتصميم دعوات أعراس فاخرة بأناقة عربية أصيلة
              <br />
              تحكم حر، خيارات لا متناهية، وجودة احترافية
            </p>
          </div>

          <button
            onClick={handleEnter}
            disabled={checking}
            className="btn-gold text-lg px-12 py-4 mt-4 animate-pulse-gold"
          >
            {checking
              ? 'جاري التحقق...'
              : isLoggedIn
                ? 'الدخول إلى لوحة التحكم'
                : 'تسجيل الدخول'}
          </button>

          {/* الميزات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-2xl mx-auto">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="card-luxe p-4 hover:border-gold-500/50 transition-all hover:-translate-y-1 group"
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="p-2.5 rounded-xl bg-gold-gradient group-hover:scale-110 transition-transform">
                      <Icon size={18} className="text-navy-900" />
                    </div>
                    <div className="text-sm font-bold gold-text-static font-naskh">
                      {f.label}
                    </div>
                    <div className="text-[10px] text-gold-100/50 font-naskh leading-relaxed">
                      {f.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer minimal />
    </main>
  );
}
