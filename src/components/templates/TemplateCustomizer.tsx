'use client';

import React, { useState, useMemo } from 'react';
import { DESIGNS } from '@/lib/templates/designs';
import { PALETTES } from '@/lib/templates/palettes';
import { FONTS } from '@/lib/templates/fonts';
import { buildTemplate } from '@/lib/templates/engine';
import { DEFAULT_CONTENT } from '@/lib/templates/defaults';
import { TemplateContent } from '@/lib/templates/types';
import TemplateRenderer from './TemplateRenderer';
import { Save, Download } from 'lucide-react';

interface Props {
  initialDesign?: string;
  initialColor?: string;
  initialFont?: string;
  onSave?: (designKey: string, colorKey: string, fontKey: string, content: TemplateContent, name: string) => Promise<void> | void;
}

export default function TemplateCustomizer({
  initialDesign,
  initialColor,
  initialFont,
  onSave
}: Props) {
  const [designKey, setDesignKey] = useState(initialDesign || DESIGNS[0].key);
  const [colorKey, setColorKey] = useState(initialColor || PALETTES[0].key);
  const [fontKey, setFontKey] = useState(initialFont || FONTS[0].key);
  const [content, setContent] = useState<TemplateContent>(DEFAULT_CONTENT);
  const [name, setName] = useState('قالب مخصص');
  const [saving, setSaving] = useState(false);

  const data = useMemo(
    () => buildTemplate({ designKey, colorKey, fontKey, content, name }),
    [designKey, colorKey, fontKey, content, name]
  );

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name || 'template'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave(designKey, colorKey, fontKey, content, name);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
      {/* Controls */}
      <div className="space-y-5">
        <div className="card-dark p-5 space-y-4">
          <h3 className="text-lg font-bold gold-text font-amiri">التخصيص الأساسي</h3>

          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">اسم القالب</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-gold"
            />
          </div>

          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">التصميم</label>
            <select
              value={designKey}
              onChange={(e) => setDesignKey(e.target.value)}
              className="input-gold"
            >
              {DESIGNS.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">اللون</label>
            <div className="grid grid-cols-5 gap-2">
              {PALETTES.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setColorKey(p.key)}
                  className={`h-10 rounded-lg border-2 transition-all ${
                    colorKey === p.key
                      ? 'border-gold-300 scale-110'
                      : 'border-transparent hover:border-gold-500/40'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${p.primary} 0%, ${p.secondary} 100%)`
                  }}
                  title={p.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">الخط</label>
            <select
              value={fontKey}
              onChange={(e) => setFontKey(e.target.value)}
              className="input-gold"
              style={{ fontFamily: FONTS.find((f) => f.key === fontKey)?.cssFamily }}
            >
              {FONTS.map((f) => (
                <option key={f.key} value={f.key} style={{ fontFamily: f.cssFamily }}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="card-dark p-5 space-y-3">
          <h3 className="text-lg font-bold gold-text font-amiri">محتوى الدعوة</h3>

          {(
            [
              ['brideName', 'اسم العروس'],
              ['groomName', 'اسم العريس'],
              ['weddingDate', 'تاريخ الزفاف'],
              ['venueName', 'اسم المكان'],
              ['venueAddress', 'العنوان']
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">{label}</label>
              <input
                value={content[field] as string}
                onChange={(e) => setContent({ ...content, [field]: e.target.value })}
                className="input-gold"
              />
            </div>
          ))}

          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">رسالة الدعوة</label>
            <textarea
              value={content.message}
              onChange={(e) => setContent({ ...content, message: e.target.value })}
              className="input-gold min-h-[80px]"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">سطر الأهل</label>
            <input
              value={content.parents}
              onChange={(e) => setContent({ ...content, parents: e.target.value })}
              className="input-gold"
            />
          </div>
        </div>

        <div className="flex gap-3">
          {onSave && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-gold flex-1 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {saving ? 'جاري الحفظ...' : 'حفظ القالب'}
            </button>
          )}
          <button
            onClick={handleExport}
            className="px-4 py-3 rounded-xl border border-gold-500/40 text-gold-100 hover:bg-gold-500/10 flex items-center gap-2 font-naskh"
          >
            <Download size={16} />
            تصدير JSON
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="card-dark p-5 flex items-start justify-center overflow-auto">
        <div className="sticky top-0">
          <TemplateRenderer data={data} scale={0.5} />
        </div>
      </div>
    </div>
  );
}
