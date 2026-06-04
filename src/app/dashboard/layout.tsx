'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import LogoMark from '@/components/LogoMark';
import {
  LogOut, LayoutDashboard, FileText, Users,
  Palette, Settings, Database, Menu, X
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  name?: string | null;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else router.push('/login');
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  // إغلاق القائمة المتنقلة عند التنقل
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('tohfa_token');
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { href: '/dashboard/invitations', label: 'الدعوات', icon: FileText },
    { href: '/dashboard/guests', label: 'الضيوف', icon: Users },
    { href: '/dashboard/templates', label: 'القوالب', icon: Palette },
    { href: '/dashboard/backup', label: 'النسخ الاحتياطي', icon: Database },
    { href: '/dashboard/settings', label: 'الإعدادات', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury">
        <div className="flex flex-col items-center gap-4">
          <Logo size={60} />
          <div className="text-gold-300 font-naskh">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-luxury">
      {/* زر القائمة للموبايل */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 right-3 z-50 p-2 rounded-xl bg-navy-800 border border-gold-500/30 text-gold-100"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* خلفية تغطية للموبايل */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 right-0 h-screen w-64 border-l border-gold-500/20 bg-navy-800/70 backdrop-blur-xl flex flex-col z-40 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <Link href="/dashboard" className="p-6 border-b border-gold-500/20 block hover:bg-gold-500/5 transition">
          <Logo size={50} />
        </Link>

        <nav className="flex-1 p-4 space-y-1 overflow-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-naskh ${
                  active
                    ? 'bg-gold-gradient text-navy-900 font-bold shadow-lg shadow-gold-500/20'
                    : 'text-gold-100/70 hover:bg-gold-500/10 hover:text-gold-200'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gold-500/20 space-y-2">
          <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-navy-900/40">
            <LogoMark size={28} />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gold-100/50 font-naskh">مرحباً</div>
              <div className="text-sm text-gold-100 font-naskh truncate font-bold">
                {user?.name || user?.username}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 hover:bg-red-500/20 transition-colors font-naskh text-sm"
          >
            <LogOut size={14} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
