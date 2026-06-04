'use client';

import React, { useMemo, useState } from 'react';
import { DESIGNS } from '@/lib/templates/designs';
import { PALETTES } from '@/lib/templates/palettes';
import { FONTS } from '@/lib/templates/fonts';
import { buildTemplate } from '@/lib/templates/engine';
import TemplatePreview from './TemplatePreview';
import { Search } from 'lucide-react';

interface Props {
  onSelect?: (designKey: string, colorKey: string, fontKey: string) => void;
}

export default function TemplateGallery({ onSelect }: Props) {
  const [designKey, setDesignKey] = useState<string | 'all'>('all');
  const [colorKey, setColorKey] = useState<string | 'all'>('all');
  const [fontKey, setFontKey] = useState<string | 'all'>('all');
  const [query, setQuery] = useState('');

  const combinations = useMemo(() => {
    const designs = designKey === 'all' ? DESIGNS : DESIGNS.filter((d) => d.key === designKey);
    const palettes = colorKey === 'all' ? PALETTES : PALETTES.filter((p) => p.key === colorKey);
    const fonts = fontKey === 'all' ? FONTS : FONTS.filter((f) => f.key === fontKey);

    const result: { designKey: string; colorKey: string; fontKey: string; name: string }[] = [];
    for (const d of designs) {
      for (const p of palettes) {
        for (const f of fonts) {
          const name = `${d.name} — ${p.name} — ${f.name}`;
          if (!query || name.includes(query)) {
            result.push({ designKey: d.key, colorKey: p.key, fontKey: f.key, name });
          }
        }
      }
    }
    return result.slice(0, 60); // أول 60 نتيجة لتجنب التحميل الزائد
  }, [designKey, colorKey, fontKey, query]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card-dark p-5 space-y-4">
        <div className="flex items-center gap-2 text-gold-100">
          <Search size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في القوالب..."
            className="input-gold flex-1"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">التصميم</label>
            <select
              value={designKey}
              onChange={(e) => setDesignKey(e.target.value)}
              className="input-gold"
            >
              <option value="all">الكل ({DESIGNS.length})</option>
              {DESIGNS.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">اللون</label>
            <select
              value={colorKey}
              onChange={(e) => setColorKey(e.target.value)}
              className="input-gold"
            >
              <option value="all">الكل ({PALETTES.length})</option>
              {PALETTES.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">الخط</label>
            <select
              value={fontKey}
              onChange={(e) => setFontKey(e.target.value)}
              className="input-gold"
            >
              <option value="all">الكل ({FONTS.length})</option>
              {FONTS.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-gold-100/50 text-xs font-naskh">
          إجمالي التركيبات الممكنة: {DESIGNS.length * PALETTES.length * FONTS.length} قالب —
          يتم عرض {combinations.length} منها
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {combinations.map((c, idx) => {
          const data = buildTemplate({
            designKey: c.designKey,
            colorKey: c.colorKey,
            fontKey: c.fontKey
          });
          return (
            <button
              key={`${c.designKey}-${c.colorKey}-${c.fontKey}-${idx}`}
              onClick={() => onSelect?.(c.designKey, c.colorKey, c.fontKey)}
              className="group card-dark p-3 hover:border-gold-500/60 transition-all hover:scale-[1.02] text-right"
            >
              <div className="flex items-center justify-center bg-black/30 rounded-lg overflow-hidden mb-3 p-2">
                <TemplatePreview data={data} maxWidth={200} maxHeight={300} />
              </div>
              <div className="text-xs text-gold-100/80 font-naskh truncate">{c.name}</div>
            </button>
          );
        })}
      </div>

      {combinations.length === 0 && (
        <div className="text-center py-12 text-gold-100/50 font-naskh">
          لا توجد نتائج تطابق البحث
        </div>
      )}
    </div>
  );
}
