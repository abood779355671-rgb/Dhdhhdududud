'use client';

import React from 'react';
import { useEditorStore } from '@/lib/editor/store';
import { createElement } from '@/lib/editor/utils';
import { Type, Image as ImageIcon, Square, Circle, Minus, Heart, Clock } from 'lucide-react';

export default function AddElementPanel() {
  const addElement = useEditorStore((s) => s.addElement);
  const canvasW = useEditorStore((s) => s.data.canvas.width);
  const canvasH = useEditorStore((s) => s.data.canvas.height);

  const items = [
    { type: 'text' as const, label: 'نص', Icon: Type },
    { type: 'image' as const, label: 'صورة', Icon: ImageIcon },
    { type: 'shape' as const, label: 'مستطيل', Icon: Square, extra: { shape: 'rect' as const } },
    { type: 'shape' as const, label: 'دائرة', Icon: Circle, extra: { shape: 'circle' as const, borderRadius: 999 } },
    { type: 'divider' as const, label: 'فاصل', Icon: Minus },
    { type: 'icon' as const, label: 'أيقونة', Icon: Heart },
    { type: 'countdown' as const, label: 'عداد', Icon: Clock }
  ];

  return (
    <div className="p-3 border-b border-gold-500/20">
      <h3 className="text-xs font-bold gold-text font-amiri mb-2">إضافة عنصر</h3>
      <div className="grid grid-cols-3 gap-1.5">
        {items.map((it, i) => {
          const { Icon } = it;
          return (
            <button
              key={i}
              onClick={() => {
                const el = createElement(it.type, canvasW / 2 - 100, canvasH / 2 - 30);
                if (it.extra) Object.assign(el, it.extra);
                addElement(el);
              }}
              className="p-2 rounded-lg border border-gold-500/20 hover:bg-gold-500/10 hover:border-gold-500/50 transition-all text-gold-100/80 flex flex-col items-center gap-1"
              title={it.label}
            >
              <Icon size={16} />
              <span className="text-[10px] font-naskh">{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
