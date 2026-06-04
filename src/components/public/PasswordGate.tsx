'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { Lock } from 'lucide-react';

interface Props {
  slug: string;
  title: string;
}

export default function PasswordGate({ slug, title }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/public/invitation/${slug}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'فشل');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          'radial-gradient(circle at center, #121833 0%, #0a0e20 70%, #050813 100%)'
      }}
    >
      <div className="card-dark p-8 max-w-md w-full text-center space-y-6">
        <Logo size={70} />
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-gold-500/10 border border-gold-500/30">
            <Lock className="text-gold-300" size={32} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold gold-text font-amiri mb-2">{title}</h2>
          <p className="text-gold-100/60 text-sm font-naskh">
            هذه الدعوة محمية بكلمة مرور — أدخلها للمتابعة
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-gold text-center"
            placeholder="كلمة المرور"
            required
            autoFocus
          />
          {error && (
            <div className="bg-red-900/30 border border-red-500/40 text-red-200 px-3 py-2 rounded-lg text-xs">
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? 'جاري التحقق...' : 'فتح الدعوة'}
          </button>
        </form>
      </div>
    </div>
  );
}
