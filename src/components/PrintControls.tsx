'use client';

import React from 'react';
import { Printer, X, Download } from 'lucide-react';

export default function PrintControls() {
  return (
    <div className="no-print fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-navy-800 border border-gold-500/30 rounded-2xl p-2 shadow-xl">
      <button
        onClick={() => window.print()}
        className="btn-gold !py-2 !px-4 text-sm flex items-center gap-1"
      >
        <Printer size={14} /> طباعة الآن
      </button>
      <button
        onClick={() => window.print()}
        className="px-4 py-2 rounded-xl border border-gold-500/30 text-gold-100 hover:bg-gold-500/10 text-sm font-naskh flex items-center gap-1"
        title="استخدم طباعة > حفظ كـ PDF في نافذة الطباعة"
      >
        <Download size={14} /> حفظ كـ PDF
      </button>
      <button
        onClick={() => window.close()}
        className="px-4 py-2 rounded-xl border border-gold-500/30 text-gold-100 hover:bg-gold-500/10 text-sm font-naskh flex items-center gap-1"
      >
        <X size={14} /> إغلاق
      </button>
    </div>
  );
}
