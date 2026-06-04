'use client';

import React from 'react';
import Logo from './Logo';
import { Heart } from 'lucide-react';

interface Props {
  minimal?: boolean;
  showLogo?: boolean;
}

export default function Footer({ minimal = false, showLogo = true }: Props) {
  const year = new Date().getFullYear();

  if (minimal) {
    return (
      <footer className="py-6 mt-12 border-t border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gold-100/50 text-xs font-naskh flex items-center justify-center gap-1">
            صُمّمت بـ <Heart size={12} className="text-gold-300 fill-gold-300" /> بواسطة
            <span className="text-gold-300 font-bold mx-1">تحفة</span>
            © {year}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-16 border-t border-gold-500/20 bg-navy-900/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {showLogo && (
            <div className="flex items-center gap-4">
              <Logo size={45} />
              <div className="text-xs text-gold-100/50 font-naskh">
                دعوات أعراس بلمسة فاخرة
              </div>
            </div>
          )}

          <div className="text-xs text-gold-100/40 font-naskh text-center">
            <p>© {year} تحفة — جميع الحقوق محفوظة</p>
            <p className="mt-1">
              الإصدار 1.0.0 • أداة شخصية
            </p>
          </div>
        </div>

        {/* خط زخرفي */}
        <div className="flex items-center justify-center mt-6 gap-2 opacity-50">
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold-500/40" />
          <div className="w-2 h-2 rounded-full bg-gold-500/60" />
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold-500/40" />
        </div>
      </div>
    </footer>
  );
}
