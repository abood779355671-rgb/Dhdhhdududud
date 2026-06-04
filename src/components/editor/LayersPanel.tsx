'use client';

import React from 'react';
import { useEditorStore } from '@/lib/editor/store';
import { Eye, EyeOff, Lock, Unlock, Trash2, Type, Image as ImageIcon, Square, Minus, Star, Clock } from 'lucide-react';

const ICONS: Record<string, React.ComponentType<any>> = {
  text: Type,
  image: ImageIcon,
  shape: Square,
  divider: Minus,
  icon: Star,
  countdown: Clock
};

export default function LayersPanel() {
  const elements = useEditorStore((s) => s.data.elements);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const setSelected = useEditorStore((s) => s.setSelected);
  const toggleVisible = useEditorStore((s) => s.toggleVisible);
  const toggleLock = useEditorStore((s) => s.toggleLock);
  const removeElements = useEditorStore((s) => s.removeElements);

  const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gold-500/20">
        <h3 className="text-sm font-bold gold-text font-amiri">الطبقات ({elements.length})</h3>
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {sorted.length === 0 && (
          <p className="text-xs text-gold-100/40 text-center py-4 font-naskh">
            لا توجد عناصر بعد
          </p>
        )}
        {sorted.map((el) => {
          const Icon = ICONS[el.type] || Square;
          const selected = selectedIds.includes(el.id);
          const label =
            el.type === 'text' ? (el as { content: string }).content.slice(0, 24) : el.type;
          return (
            <div
              key={el.id}
              onClick={(e) => {
                if (e.shiftKey) {
                  setSelected(
                    selected
                      ? selectedIds.filter((x) => x !== el.id)
                      : [...selectedIds, el.id]
                  );
                } else {
                  setSelected([el.id]);
                }
              }}
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs transition ${
                selected
                  ? 'bg-gold-500/20 border border-gold-500/40'
                  : 'hover:bg-gold-500/5 border border-transparent'
              }`}
            >
              <Icon size={14} />
              <span className="flex-1 truncate text-gold-100/80 font-naskh">{label || el.type}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisible(el.id);
                }}
                className="text-gold-100/60 hover:text-gold-200"
                title={el.visible ? 'إخفاء' : 'إظهار'}
              >
                {el.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLock(el.id);
                }}
                className="text-gold-100/60 hover:text-gold-200"
                title={el.locked ? 'فك القفل' : 'قفل'}
              >
                {el.locked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeElements([el.id]);
                }}
                className="text-red-300 hover:text-red-200"
                title="حذف"
              >
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
