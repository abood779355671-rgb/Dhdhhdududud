'use client';

import { useEffect } from 'react';
import Logo from '@/components/Logo';
import { RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-luxury">
      <div className="max-w-md text-center space-y-6 animate-fade-in-up">
        <Logo size={80} />

        <div className="space-y-3">
          <h1 className="text-3xl font-bold gold-text font-amiri">حدث خطأ ما</h1>
          <p className="text-gold-100/60 font-naskh leading-relaxed">
            عذراً، حدث خطأ غير متوقع. يمكنك المحاولة مجدداً أو العودة للرئيسية.
          </p>
          {error.message && (
            <details className="text-xs text-gold-100/40 font-mono bg-navy-900/50 p-3 rounded-lg text-right">
              <summary className="cursor-pointer font-naskh text-gold-100/60">
                تفاصيل تقنية
              </summary>
              <pre className="mt-2 whitespace-pre-wrap break-words">{error.message}</pre>
            </details>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          <button onClick={reset} className="btn-gold flex items-center gap-2">
            <RefreshCw size={16} />
            المحاولة مجدداً
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl border border-gold-500/40 text-gold-100 hover:bg-gold-500/10 flex items-center gap-2 font-naskh"
          >
            <Home size={16} />
            الرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
