'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import DecorationOrnament from '@/components/DecorationOrnament';
import { LogIn, User, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل تسجيل الدخول');
      if (data.token) localStorage.setItem('tohfa_token', data.token);
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-luxury">
      <div className="w-full max-w-md animate-fade-in-scale">
        <div className="text-center mb-6">
          <Logo size={100} showTagline />
        </div>

        <div className="card-luxe p-8 shadow-2xl">
          <DecorationOrnament variant="divider" width={200} className="mx-auto mb-4" />

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold gold-text font-amiri">تسجيل الدخول</h2>
            <p className="text-xs text-gold-100/50 mt-1 font-naskh">
              مرحباً بك مجدداً
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gold-100 text-sm mb-2 font-naskh flex items-center gap-1.5">
                <User size={13} /> اسم المستخدم
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-gold"
                placeholder="أدخل اسم المستخدم"
                required
                autoFocus
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-gold-100 text-sm mb-2 font-naskh flex items-center gap-1.5">
                <KeyRound size={13} /> كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-gold"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl text-sm font-naskh animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              {loading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gold-500/20 text-center">
            <p className="text-gold-100/40 text-xs font-naskh">
              هذه الأداة مخصصة للاستخدام الشخصي فقط
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
