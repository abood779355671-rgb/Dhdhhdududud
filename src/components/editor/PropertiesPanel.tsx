'use client';

import React from 'react';
import { useEditorStore } from '@/lib/editor/store';
import { AnyElement, TextElement, ImageElement, ShapeElement, DividerElement, IconElement } from '@/lib/templates/types';
import { FONTS } from '@/lib/templates/fonts';
import ColorPicker from './ColorPicker';
import {
  AlignRight, AlignCenter, AlignLeft, FlipHorizontal, FlipVertical,
  ArrowUp, ArrowDown, ChevronsUp, ChevronsDown
} from 'lucide-react';

export default function PropertiesPanel() {
  const data = useEditorStore((s) => s.data);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const updateElement = useEditorStore((s) => s.updateElement);
  const setCanvasBackground = useEditorStore((s) => s.setCanvasBackground);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);
  const bringToFront = useEditorStore((s) => s.bringToFront);
  const sendToBack = useEditorStore((s) => s.sendToBack);

  const selected: AnyElement[] = data.elements.filter((e) => selectedIds.includes(e.id));

  if (selected.length === 0) {
    return (
      <div className="p-4 space-y-4">
        <h3 className="text-sm font-bold gold-text font-amiri">إعدادات الكنفاس</h3>
        <ColorPicker
          label="لون الخلفية"
          value={data.canvas.background}
          onChange={setCanvasBackground}
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">العرض</label>
            <input
              type="number"
              value={data.canvas.width}
              readOnly
              className="input-gold"
            />
          </div>
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">الارتفاع</label>
            <input
              type="number"
              value={data.canvas.height}
              readOnly
              className="input-gold"
            />
          </div>
        </div>
        <p className="text-xs text-gold-100/40 font-naskh text-center pt-4">
          اختر عنصراً لعرض خصائصه
        </p>
      </div>
    );
  }

  const el = selected[0];
  const update = (patch: Partial<AnyElement>) => updateElement(el.id, patch);

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold gold-text font-amiri">خصائص العنصر</h3>
        <span className="text-xs text-gold-100/50">{el.type}</span>
      </div>

      {/* الموضع والحجم */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">X</label>
            <input
              type="number"
              value={Math.round(el.x)}
              onChange={(e) => update({ x: Number(e.target.value) })}
              className="input-gold"
            />
          </div>
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">Y</label>
            <input
              type="number"
              value={Math.round(el.y)}
              onChange={(e) => update({ y: Number(e.target.value) })}
              className="input-gold"
            />
          </div>
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">العرض</label>
            <input
              type="number"
              value={Math.round(el.width)}
              onChange={(e) => update({ width: Number(e.target.value) })}
              className="input-gold"
            />
          </div>
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">الارتفاع</label>
            <input
              type="number"
              value={Math.round(el.height)}
              onChange={(e) => update({ height: Number(e.target.value) })}
              className="input-gold"
            />
          </div>
        </div>

        <div>
          <label className="block text-gold-100/70 text-xs mb-1 font-naskh">
            التدوير ({el.rotation}°)
          </label>
          <input
            type="range"
            min={0}
            max={360}
            value={el.rotation}
            onChange={(e) => update({ rotation: Number(e.target.value) })}
            className="w-full accent-gold-400"
          />
        </div>

        <div>
          <label className="block text-gold-100/70 text-xs mb-1 font-naskh">
            الشفافية ({Math.round(el.opacity * 100)}%)
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={el.opacity}
            onChange={(e) => update({ opacity: Number(e.target.value) })}
            className="w-full accent-gold-400"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => update({ flipH: !el.flipH })}
            className={`flex-1 p-2 rounded-lg text-xs flex items-center justify-center gap-1 ${
              el.flipH ? 'bg-gold-500/30 text-gold-100' : 'bg-gold-500/5 text-gold-100/60'
            }`}
          >
            <FlipHorizontal size={12} /> أفقي
          </button>
          <button
            onClick={() => update({ flipV: !el.flipV })}
            className={`flex-1 p-2 rounded-lg text-xs flex items-center justify-center gap-1 ${
              el.flipV ? 'bg-gold-500/30 text-gold-100' : 'bg-gold-500/5 text-gold-100/60'
            }`}
          >
            <FlipVertical size={12} /> رأسي
          </button>
        </div>
      </div>

      {/* النص */}
      {el.type === 'text' && (
        <div className="space-y-2 pt-2 border-t border-gold-500/20">
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">المحتوى</label>
            <textarea
              value={(el as TextElement).content}
              onChange={(e) => update({ content: e.target.value } as Partial<TextElement>)}
              className="input-gold min-h-[60px]"
            />
          </div>
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">الخط</label>
            <select
              value={(el as TextElement).fontKey}
              onChange={(e) => update({ fontKey: e.target.value } as Partial<TextElement>)}
              className="input-gold"
            >
              {FONTS.map((f) => (
                <option key={f.key} value={f.key}>{f.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">الحجم</label>
              <input
                type="number"
                value={(el as TextElement).fontSize}
                onChange={(e) => update({ fontSize: Number(e.target.value) } as Partial<TextElement>)}
                className="input-gold"
              />
            </div>
            <div>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">السماكة</label>
              <select
                value={(el as TextElement).fontWeight}
                onChange={(e) => update({ fontWeight: Number(e.target.value) } as Partial<TextElement>)}
                className="input-gold"
              >
                {[300, 400, 500, 600, 700, 800].map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">ارتفاع السطر</label>
              <input
                type="number"
                step={0.1}
                value={(el as TextElement).lineHeight}
                onChange={(e) => update({ lineHeight: Number(e.target.value) } as Partial<TextElement>)}
                className="input-gold"
              />
            </div>
            <div>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">تباعد الأحرف</label>
              <input
                type="number"
                step={0.5}
                value={(el as TextElement).letterSpacing}
                onChange={(e) => update({ letterSpacing: Number(e.target.value) } as Partial<TextElement>)}
                className="input-gold"
              />
            </div>
          </div>
          <ColorPicker
            label="اللون"
            value={(el as TextElement).color}
            onChange={(c) => update({ color: c } as Partial<TextElement>)}
          />
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">المحاذاة</label>
            <div className="flex gap-1">
              {(['right', 'center', 'left'] as const).map((a) => {
                const Icon = a === 'right' ? AlignRight : a === 'center' ? AlignCenter : AlignLeft;
                return (
                  <button
                    key={a}
                    onClick={() => update({ textAlign: a } as Partial<TextElement>)}
                    className={`flex-1 p-2 rounded-lg ${
                      (el as TextElement).textAlign === a
                        ? 'bg-gold-500/30 text-gold-100'
                        : 'bg-gold-500/5 text-gold-100/60'
                    }`}
                  >
                    <Icon size={14} className="mx-auto" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* الشكل */}
      {el.type === 'shape' && (
        <div className="space-y-2 pt-2 border-t border-gold-500/20">
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">نوع الشكل</label>
            <select
              value={(el as ShapeElement).shape}
              onChange={(e) => update({ shape: e.target.value as 'rect' | 'circle' | 'ellipse' | 'frame' } as Partial<ShapeElement>)}
              className="input-gold"
            >
              <option value="rect">مستطيل</option>
              <option value="circle">دائرة</option>
              <option value="ellipse">بيضوي</option>
            </select>
          </div>
          <ColorPicker
            label="لون التعبئة"
            value={(el as ShapeElement).fill}
            onChange={(c) => update({ fill: c } as Partial<ShapeElement>)}
          />
          <ColorPicker
            label="لون الحدود"
            value={(el as ShapeElement).stroke}
            onChange={(c) => update({ stroke: c } as Partial<ShapeElement>)}
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">سماكة</label>
              <input
                type="number"
                value={(el as ShapeElement).strokeWidth}
                onChange={(e) => update({ strokeWidth: Number(e.target.value) } as Partial<ShapeElement>)}
                className="input-gold"
              />
            </div>
            <div>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">انحناء الزوايا</label>
              <input
                type="number"
                value={(el as ShapeElement).borderRadius}
                onChange={(e) => update({ borderRadius: Number(e.target.value) } as Partial<ShapeElement>)}
                className="input-gold"
              />
            </div>
          </div>
        </div>
      )}

      {/* الصورة */}
      {el.type === 'image' && (
        <div className="space-y-2 pt-2 border-t border-gold-500/20">
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">رابط الصورة</label>
            <input
              type="text"
              value={(el as ImageElement).src}
              onChange={(e) => update({ src: e.target.value } as Partial<ImageElement>)}
              className="input-gold"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">
              رفع صورة (تحويل لـ Base64)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    update({ src: reader.result as string } as Partial<ImageElement>);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="input-gold text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">انحناء</label>
              <input
                type="number"
                value={(el as ImageElement).borderRadius}
                onChange={(e) => update({ borderRadius: Number(e.target.value) } as Partial<ImageElement>)}
                className="input-gold"
              />
            </div>
            <div>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">سماكة حد</label>
              <input
                type="number"
                value={(el as ImageElement).borderWidth}
                onChange={(e) => update({ borderWidth: Number(e.target.value) } as Partial<ImageElement>)}
                className="input-gold"
              />
            </div>
          </div>
          <ColorPicker
            label="لون الحد"
            value={(el as ImageElement).borderColor}
            onChange={(c) => update({ borderColor: c } as Partial<ImageElement>)}
          />
        </div>
      )}

      {/* الفاصل */}
      {el.type === 'divider' && (
        <div className="space-y-2 pt-2 border-t border-gold-500/20">
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">النمط</label>
            <select
              value={(el as DividerElement).style}
              onChange={(e) => update({ style: e.target.value as DividerElement['style'] } as Partial<DividerElement>)}
              className="input-gold"
            >
              <option value="line">خط</option>
              <option value="ornament-1">زخرفة 1</option>
              <option value="ornament-2">زخرفة 2</option>
              <option value="ornament-3">زخرفة 3</option>
              <option value="dots">نقاط</option>
            </select>
          </div>
          <ColorPicker
            label="اللون"
            value={(el as DividerElement).color}
            onChange={(c) => update({ color: c } as Partial<DividerElement>)}
          />
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">السماكة</label>
            <input
              type="number"
              value={(el as DividerElement).thickness}
              onChange={(e) => update({ thickness: Number(e.target.value) } as Partial<DividerElement>)}
              className="input-gold"
            />
          </div>
        </div>
      )}

      {/* الأيقونة */}
      {el.type === 'icon' && (
        <div className="space-y-2 pt-2 border-t border-gold-500/20">
          <div>
            <label className="block text-gold-100/70 text-xs mb-1 font-naskh">الأيقونة</label>
            <select
              value={(el as IconElement).name}
              onChange={(e) => update({ name: e.target.value } as Partial<IconElement>)}
              className="input-gold"
            >
              {['Heart', 'Crown', 'Leaf', 'Star', 'Flower', 'Gem', 'Sparkles', 'Music'].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <ColorPicker
            label="اللون"
            value={(el as IconElement).color}
            onChange={(c) => update({ color: c } as Partial<IconElement>)}
          />
        </div>
      )}

      {/* الترتيب */}
      <div className="pt-2 border-t border-gold-500/20 space-y-2">
        <h4 className="text-xs font-bold text-gold-100/80 font-naskh">الترتيب</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => bringForward([el.id])}
            className="p-2 rounded-lg bg-gold-500/10 text-gold-100 text-xs flex items-center justify-center gap-1 hover:bg-gold-500/20"
          >
            <ArrowUp size={12} /> للأمام
          </button>
          <button
            onClick={() => sendBackward([el.id])}
            className="p-2 rounded-lg bg-gold-500/10 text-gold-100 text-xs flex items-center justify-center gap-1 hover:bg-gold-500/20"
          >
            <ArrowDown size={12} /> للخلف
          </button>
          <button
            onClick={() => bringToFront([el.id])}
            className="p-2 rounded-lg bg-gold-500/10 text-gold-100 text-xs flex items-center justify-center gap-1 hover:bg-gold-500/20"
          >
            <ChevronsUp size={12} /> الأمامية
          </button>
          <button
            onClick={() => sendToBack([el.id])}
            className="p-2 rounded-lg bg-gold-500/10 text-gold-100 text-xs flex items-center justify-center gap-1 hover:bg-gold-500/20"
          >
            <ChevronsDown size={12} /> الخلفية
          </button>
        </div>
      </div>
    </div>
  );
}
